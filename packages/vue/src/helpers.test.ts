import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { createEdenQueryHelpers } from "./helpers";

const { invalidateQueries, mockedUseMutation } = vi.hoisted(() => {
  return {
    invalidateQueries: vi.fn(async () => undefined),
    mockedUseMutation: vi.fn((options: any) => options as any),
  };
});

vi.mock("@tanstack/vue-query", () => {
  return {
    useQuery: vi.fn(),
    useMutation: mockedUseMutation,
    useQueryClient: vi.fn(() => ({
      invalidateQueries,
    })),
  };
});

describe("createEdenQueryHelpers.useMutation", () => {
  beforeEach(() => {
    invalidateQueries.mockClear();
    mockedUseMutation.mockClear();
  });

  it("invalidates own subtree and extra targets after success", async () => {
    const client = {
      users: {
        post: vi.fn(async () => ({
          data: { id: 1 },
          error: null,
          status: 200,
        })),
      },
      posts: {
        get: vi.fn(async () => ({
          data: [],
          error: null,
          status: 200,
        })),
      },
    };

    const eden = createEdenQueryHelpers(client);
    const userOnSuccess = vi.fn(async () => undefined);

    eden.useMutation(eden.proxy.users.post, {
      invalidates: [eden.proxy.posts.get],
      onSuccess: userOnSuccess,
    } as any);

    const options = mockedUseMutation.mock.calls[0]?.[0];
    await options?.onSuccess?.({ id: 1 }, undefined, undefined, undefined);

    expect(userOnSuccess).toHaveBeenCalledTimes(1);
    expect(invalidateQueries).toHaveBeenCalledTimes(2);
  });
});
