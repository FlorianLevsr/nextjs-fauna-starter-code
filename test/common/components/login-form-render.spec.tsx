import { InMemoryCache } from '@apollo/client'
import React from 'react'
import testRenderer from 'react-test-renderer'
import { LoginForm } from '../../../src/common/components'
import { TestAuth } from '../../utils/auth'

/**
 * SECTION Test suite
 */
describe('Login form', () => {
  let cache: InMemoryCache

  // ANCHOR Unit test - check for the component's HTML rendering
  it('should render correctly', () => {
    // Create a static render
    const tree = testRenderer
      .create(
        <TestAuth cache={cache}>
          <LoginForm
            callback={async () => undefined}
            mutationResult={{ loading: false, called: true }}
          />
        </TestAuth>
      )
      .toJSON()

    // Check the static render against the snapshot
    expect(tree).toMatchSnapshot()
  })
})
