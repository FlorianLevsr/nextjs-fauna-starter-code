import React from 'react'
import { InMemoryCache } from '@apollo/client'
import { MockedProvider } from '@apollo/client/testing'
import { FC } from 'react'
import {
  loginQuery,
  logoutQuery,
  query,
  signupQuery,
  AuthContextProvider,
} from '../../src/common/data/auth'
import { User } from '../../src/common/types/fauna'
import { MockType } from './types'

export const user: User = { _id: 'user0', _ts: 0, username: 'test' }

const initialData = {
  currentUser: null,
}

const queryMock: MockType<typeof query> = {
  request: {
    query,
    variables: {},
  },
  result: {
    data: initialData,
  },
}

const signupQueryMock: MockType<typeof signupQuery> = {
  request: {
    query: signupQuery,
    variables: { username: 'test', password: 'test' },
  },
  result: {
    data: {
      signupUser: {
        secret: 'authenticated-token',
        instance: user,
      },
    },
  },
}

const loginQueryMock: MockType<typeof loginQuery> = {
  request: {
    query: loginQuery,
    variables: { username: 'test', password: 'test' },
  },
  result: {
    data: {
      loginUser: {
        secret: 'authenticated-token',
        instance: user,
      },
    },
  },
}

const logoutQueryMock: MockType<typeof logoutQuery> = {
  request: {
    query: logoutQuery,
    variables: {},
  },
  result: {
    data: {
      logoutData: true,
    },
  },
}

const mocks = [queryMock, signupQueryMock, loginQueryMock, logoutQueryMock]

export const TestAuth: FC<{ cache: InMemoryCache }> = ({ cache, children }) => (
  <MockedProvider cache={cache} mocks={mocks} addTypename={false}>
    <AuthContextProvider>{children}</AuthContextProvider>
  </MockedProvider>
)
