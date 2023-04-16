@Library('common') _

buildPipeline([
  name:         'blog-server',
  dockerfile:   'prod.Dockerfile',
  manifestRepo: 'git@github.com:qwp0905/kubernetes.git',
  manifestFile:  'service/blog-server/deployment.yaml'
])