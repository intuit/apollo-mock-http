import { ApolloLink, Observable } from "apollo-link";

export class MockLink extends ApolloLink {
  constructor(mockLinkConfig) {
    super();
    const dataStringFromLocalStorage = localStorage.getItem("AMH_mockdata");
    const mockDataFromLocalStorage = JSON.parse(dataStringFromLocalStorage);
    const { enableMock, mockData, targetOperations, defaultAPICallDuration } =
      mockLinkConfig;
    this.config = {
      enableMock,
      mockData: mockData ? mockData : mockDataFromLocalStorage,
      targetOperations,
      defaultAPICallDuration,
    };
  }

  request(operation, forward) {
    const { enableMock, targetOperations, defaultAPICallDuration } =
      this.config;
    const isOperationMocked = targetOperations.includes(
      operation.operationName
    );
    if (enableMock && isOperationMocked) {
      return new Observable((observer) => {
        console.log("In Mock Link ...");
        setTimeout(() => {
          const relatedMockdata = this.config.mockData[operation.operationName];
          observer.next(relatedMockdata);
          observer.complete();
        }, defaultAPICallDuration);
      });
    }
    return forward(operation);
  }
}

/**
 * links - links array used for ApolloClient
 * enableMock - enable or disable mocking flag
 * targetOperations - list of operations to target
 * mockData - data config for success / error responses
 * createCustomLinkObj - to create link object as per user's links structure
 */
export const injectMock = ({
  links,
  enableMock = true,
  targetOperations,
  mockData,
  createCustomLinkObj,
  defaultAPICallDuration = 2000,
}) => {
  const mockLink = new MockLink({
    enableMock,
    mockData,
    targetOperations,
    defaultAPICallDuration,
  });

  const mockLinkObj = createCustomLinkObj
    ? createCustomLinkObj(mockLink)
    : mockLink;

  links.splice(links.length - 1, 0, mockLinkObj);
};
