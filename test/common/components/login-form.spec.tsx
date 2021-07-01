import { InMemoryCache } from '@apollo/client'
import { act } from '@testing-library/react'
import { mount } from 'enzyme'
import React from 'react'
import { LoginForm } from '../../../src/common/components'
import { query, useAuthContext } from '../../../src/common/data/auth'
import usersService from '../../../src/common/state/users'
import { FaunaTokenManager } from '../../../src/common/utils'
import { TestAuth, user } from '../../utils/auth'

// This function forces tests to wait for hooks to resolve
const waitForResponse = (): Promise<void> =>
  new Promise((res) => setTimeout(res, 0))

const WrappedLoginForm = () => {
  const { actions } = useAuthContext()
  const [login, mutationResult] = actions.useLogin()

  const callback = async (
    username: string,
    password: string
  ): Promise<void> => {
    try {
      await login({ variables: { username, password } })
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }

  return <LoginForm callback={callback} mutationResult={mutationResult} />
}

/**
 * SECTION Test suite
 */
describe('Login form', () => {
  let cache: InMemoryCache

  // ANCHOR Operations to trigger before each test
  beforeEach(() => {
    // Reset memory cache
    cache = new InMemoryCache({ addTypename: false })
  })

  // ANCHOR Functional test - check the component intially triggers a query that fills the cache
  it('should find no logged user', async () => {
    process.env.NEXT_PUBLIC_FAUNA_SECRET = 'public-token'

    // Mount component in a virtual DOM
    mount(
      <TestAuth cache={cache}>
        <WrappedLoginForm />
      </TestAuth>
    )

    // Wait for hooks to resolve
    await act(async () => {
      await waitForResponse()
    })

    // Read result from the GraphQL query
    const data = cache.readQuery({ query })
    // The query result should be null
    expect(data?.currentUser).toBeNull()
    const tokenManager = new FaunaTokenManager()
    const token = tokenManager.get()
    expect(token).toEqual('public-token')
    expect(typeof usersService.get(token)).toEqual('undefined')
  })

  // ANCHOR Functional test - check the component triggers a mutation that changes data in the cache
  it('should populate the logged user in the cache when submitted', async () => {
    process.env.NEXT_PUBLIC_FAUNA_SECRET = 'public-token'

    const element = mount(
      <TestAuth cache={cache}>
        <WrappedLoginForm />
      </TestAuth>
    )

    // Wait for hooks to resolve
    await act(async () => {
      await waitForResponse()
      // Simulate a click on the button
      element.find('input[name="username"]').simulate('change', {
        target: {
          value: 'test',
        },
      })
      element.find('input[name="password"]').simulate('change', {
        target: {
          value: 'test',
        },
      })
      element.simulate('submit')
      // Wait for hooks to resolve again
      await waitForResponse()
    })

    // Read result from the GraphQL query
    const data = cache.readQuery({ query })
    expect(data?.currentUser).not.toBeNull()
    expect(data?.currentUser?._id).toEqual(user._id)
    expect(data?.currentUser?.username).toEqual(user.username)
    const tokenManager = new FaunaTokenManager()
    const token = tokenManager.get()
    expect(token).toEqual('authenticated-token')
    expect(usersService.get(token)).toEqual(user)
  })
})
