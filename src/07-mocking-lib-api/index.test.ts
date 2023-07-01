import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');

interface Post {
  id: number;
  title: string;
}

const baseURL = 'https://jsonplaceholder.typicode.com';
const relativePath = '/posts';
const responseData: Post[] = [{ id: 1, title: 'Post 1' }];

const createMockAxiosClient = (responseData: Post[]) => {
  return {
    get: jest.fn().mockResolvedValue({ data: responseData }),
  };
};

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosClient = createMockAxiosClient(responseData);
    (axios.create as jest.Mock).mockReturnValue(axiosClient);

    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: baseURL,
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosClient = createMockAxiosClient(responseData);
    (axios.create as jest.Mock).mockReturnValue(axiosClient);

    await throttledGetDataFromApi(relativePath);
    jest.runAllTimers();

    expect(axiosClient.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const axiosClient = createMockAxiosClient(responseData);
    (axios.create as jest.Mock).mockReturnValue(axiosClient);

    const result = await throttledGetDataFromApi(relativePath);

    expect(result).toEqual(responseData);
  });
});
