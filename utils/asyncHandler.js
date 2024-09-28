class AsyncHandler {
  constructor() {}

  prismaQuery = async (query) => {
    try {
      const result = await query();
      return [result, null];
    } catch (err) {
      return [null, err];
    }
  };
}

const asyncHandler = new AsyncHandler();
export default asyncHandler;
