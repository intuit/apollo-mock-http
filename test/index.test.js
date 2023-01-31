import * as mocker from "../src/index";
import { ApolloLink, Observable } from 'apollo-link';

describe('MockLink Overall', () => {
  it('Should check exports', () => {
    expect(mocker.injectMock).toBeDefined();
    expect(mocker.MockLink).toBeDefined();
  })

  it('Should inject mockLink', () => {
    const links = [{name: 'httpLink', link: new ApolloLink()}];
    mocker.injectMock({
      links,
      enableMock: true,
      targetOperations: ['getCompanyName'],
      mockData: {
        'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
      },
      createCustomLinkObj: null,
    });
    expect(links.length).toBe(2);
    expect(links[0].name).toBe('mockHttp');
    expect(links[0].link.constructor).toBe(mocker.MockLink);
  });

  it('Should inject mockLink with default enabled mock', () => {
    const links = [{name: 'httpLink', link: new ApolloLink()}];
    mocker.injectMock({
      links,
      enableMock: undefined,
      targetOperations: ['getCompanyName'],
      mockData: {
        'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
      },
      createCustomLinkObj: null,
    });
    expect(links.length).toBe(2);
    expect(links[0].name).toBe('mockHttp');
    expect(links[0].link.constructor).toBe(mocker.MockLink);
  });

  it('Should inject custom structured mockLink', () => {
    const links = [{
      linkName: 'httpLink',
      linkObj: new ApolloLink()
    }];
    mocker.injectMock({
      links,
      enableMock: true,
      targetOperations: ['getCompanyName'],
      mockData: {
        'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
      },
      createCustomLinkObj: (mockLink) => ({
        linkName: 'customMockLink',
        linkObj: mockLink
      }),
    });
    expect(links.length).toBe(2);
    expect(links[0].linkName).toBe('customMockLink');
    expect(links[0].linkObj.constructor).toBe(mocker.MockLink);
  });

  it('Should block and return mocked response if operation is mocked', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');

    const links = [{name: 'httpLink', link: new ApolloLink()}];
    const mockDataConfig = {
      links,
      enableMock: true,
      targetOperations: ['getCompanyName'],
      mockData: {
        'getCompanyName': { data: { name: 'Test', __typename: 'String' }, error: null },
      },
      createCustomLinkObj: null,
    };
    mocker.injectMock(mockDataConfig);
    expect(links.length).toBe(2);
    expect(links[0].name).toBe('mockHttp');
    expect(links[0].link.constructor).toBe(mocker.MockLink);
    const forwardSpy = jest.fn();
    const mockLink = links[0].link;
    const op = {operationName: 'getCompanyName'};
    const observableObj = mockLink.request(op, forwardSpy);
    const fakeObserver = {
      next: jest.fn(),
      complete: jest.fn()
    };
    observableObj.subscribe(fakeObserver);
    jest.runAllTimers();

    expect(fakeObserver.next).toHaveBeenCalledWith(mockDataConfig.mockData.getCompanyName)
    expect(fakeObserver.complete).toHaveBeenCalled();
    expect(forwardSpy).not.toHaveBeenCalledWith(op);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000);

  });

  it('Should forward operation if operation is not mocked', () => {
    const links = [{name: 'httpLink', link: new ApolloLink()}];
    mocker.injectMock({
      links,
      enableMock: true,
      targetOperations: [],
      mockData: {
        'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
      },
      createCustomLinkObj: null,
    });
    expect(links.length).toBe(2);
    expect(links[0].name).toBe('mockHttp');
    expect(links[0].link.constructor).toBe(mocker.MockLink);
    // mocklink request operation.. forward spy
    const forwardSpy = jest.fn();
    const mockLink = links[0].link;
    const op = {operationName: 'getCompanyName'};
    mockLink.request(op, forwardSpy);
    expect(forwardSpy).toHaveBeenCalledWith(op);
  });

  it('Should forward operation if mocking is disabled', () => {
    const links = [{name: 'httpLink', link: new ApolloLink()}];
    mocker.injectMock({
      links,
      enableMock: false,
      targetOperations: ['getCompanyName'],
      mockData: {
        'getCompanyName': {data: {name: 'Test', __typename: 'String'}, error: null},
      },
      createCustomLinkObj: null,
    });
    expect(links.length).toBe(2);
    expect(links[0].name).toBe('mockHttp');
    expect(links[0].link.constructor).toBe(mocker.MockLink);
    // mocklink request operation.. forward spy
    const forwardSpy = jest.fn();
    const mockLink = links[0].link;
    const op = {operationName: 'getCompanyName'};
    mockLink.request(op, forwardSpy);
    expect(forwardSpy).toHaveBeenCalledWith(op);
  });

})