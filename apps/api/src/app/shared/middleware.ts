import { createMiddleware } from 'hono/factory'

import { RequestContext } from '.'

type AppContextMiddlewareVariables = {
  Variables: {
    /**
     * The context of this request.
     */
    context: RequestContext
  }
}

/**
 * Set the {@link RequestContext} in the request context.
 */
export const setRequestContext = createMiddleware<AppContextMiddlewareVariables>(
  async (context, next) => {
    context.set('context', RequestContext.default())
    await next()
  }
)
