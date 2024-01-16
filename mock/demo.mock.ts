import definePostMock from './index.mock'

export default definePostMock({
  url: '/api/test',
  body: {
    code: 200,
    data: {
      msg: '测试1111111111111111'
    }
  }
})
