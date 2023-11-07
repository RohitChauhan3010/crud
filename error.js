export default (catchError) => async (req, res, next) => {
    await Promise.resolve(catchError(req, res, next)).catch(next);
};