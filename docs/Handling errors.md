# Error & Exception Handling

When using Express, normally we must catch any errors that occur in asynchronous code. For example awaited calls made to a function that returns a promise should be wrapped in a try/catch block, so that if the promise rejects, the thrown rejection can be forwarded to next so it can reach the error handlers.

```js
const asyncFunction = async (req: Request, res: Response) => {
    try {
        await apiRequest();
    } catch (err) {
        next(err)
    }
};
```
When using express-async-errors we don't need to wrap the promise returning function in a try catch block - if a promise is rejected (for example an api call errors), the rejection will be automatically forwarded to next, so it can reach the error handlers. The above example function can now become 

```js
const asyncFunction = async (req: Request, res: Response) => {
        await apiRequest();
};
```
Note, if we were to use express router to define additional routes in a separate files, then we would need to apply the patch in that file as well. 

```js
import "express-async-errors";  // <----- apply async error patch
const router = Router();

```