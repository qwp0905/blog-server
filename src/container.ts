import { S3 } from 'aws-sdk'
import IORedis from 'ioredis'
import { DataSource } from 'typeorm'
import { GenerateTokenHandler } from './auth/command/generate-token.handler'
import { JwtService } from './auth/jwt.service'
import { JwtStrategy } from './auth/strategies/jwt.strategy'
import { AwsS3Config } from './config/aws.config'
import { RedisCacheConfig, RedisLockConfig, RedisSubConfig } from './config/redis.config'
import { TypeOrmConfig } from './config/typeorm.config'
import { RedisService } from './external/redis/redis.service'
import { AwsS3Service } from './external/aws/s3.service'
import { CreateAccountHandler } from './modules/account/application/command/create-account/create-account.handler'
import { FindAccountHandler } from './modules/account/application/command/find-account/find-account.handler'
import { LoginHandler } from './modules/account/application/command/login/login.handler'
import { LogoutHandler } from './modules/account/application/command/logout/logout.handler'
import { RefreshTokenHandler } from './modules/account/application/command/refresh-token/refresh-token.handler'
import { UpdateAccountHandler } from './modules/account/application/command/update-account/update-account.handler'
import { AccountFactory } from './modules/account/domain/account.factory'
import { AccountRepository } from './modules/account/infrastructure/repositories/account.repository'
import { AccountController } from './modules/account/interface/account.controller'
import { CreateArticleHandler } from './modules/article/application/command/create-article/create-article.handler'
import { DeleteArticleHandler } from './modules/article/application/command/delete-article/delete-article.handler'
import { LookupArticleHandler } from './modules/article/application/command/lookup-article/lookup-article.handler'
import { UpdateArticleHandler } from './modules/article/application/command/update-article/update-article.handler'
import { FindArticleAllHandler } from './modules/article/application/query/find-article-all/find-article-all.handler'
import { FindArticleDetailHandler } from './modules/article/application/query/find-detail/find-article-detail.handler'
import { FindTagsHandler } from './modules/article/application/query/find-tags/find-tags.handler'
import { ArticleFactory } from './modules/article/domain/article.factory'
import { RedisAdapter } from './modules/article/infrastructure/adapters/redis.adapter'
import { ArticleRepository } from './modules/article/infrastructure/repositories/article.repository'
import { ArticleController } from './modules/article/interface/article.controller'
import { CreateCommentHandler } from './modules/comment/application/command/create-comment/create-comment.handler'
import { DeleteCommentHandler } from './modules/comment/application/command/delete-comment/delete-comment.handler'
import { UpdateCommentHandler } from './modules/comment/application/command/update-comment/update-comment.handler'
import { FindCommentHandler } from './modules/comment/application/query/find-comment.handler'
import { CommentFactory } from './modules/comment/domain/comment.factory'
import { CommentRepository } from './modules/comment/infrastructure/repositories/comment.repository'
import { CommentController } from './modules/comment/interface/comment.controller'
import { CreateHeartHandler } from './modules/heart/application/command/create-heart/create-heart.handler'
import { DeleteHeartHandler } from './modules/heart/application/command/delete-heart/delete-heart.handler'
import { FindHeartHandler } from './modules/heart/application/query/find-heart.handler'
import { HeartFactory } from './modules/heart/domain/heart.factory'
import { HeartRepository } from './modules/heart/infrastructure/repositories/heart.repository'
import { HeartController } from './modules/heart/interface/heart.controller'
import { UploadHandler } from './modules/upload/application/upload.handler'
import { AmazonAdapter } from './modules/upload/infrastructure/amazon.adapter'
import { UploadController } from './modules/upload/interface/upload.controller'
import { CommandBus, QueryBus } from './shared/lib/bus'
import { ValidationPipe } from './shared/lib/validation-pipe'
import { ProfileController } from './modules/profile/interface/profile.controller'
import { ProfileFactory } from './modules/profile/domain/profile.factory'
import { ProfileRepository } from './modules/profile/infrastructure/repositories/profile.repository'
import { FindProfileHandler } from './modules/profile/application/query/find-profile.handler'
import { UpdateProfileHandler } from './modules/profile/application/command/update-profile.handler'
import { App } from './app'

// External ###############################################################
export const DATABASE = new DataSource(TypeOrmConfig)
export const REDIS_CACHE = new IORedis(RedisCacheConfig)
export const REDIS_SUB = new IORedis(RedisSubConfig)
export const REDIS_LOCK = new IORedis(RedisLockConfig)
export const AWS_S3 = new S3(AwsS3Config)

// Bus ###############################################################
const commandBus = new CommandBus()

const queryBus = new QueryBus()

// Utils ###############################################################
const validationPipe = new ValidationPipe()

// External modules ###############################################################
const redisService = new RedisService(REDIS_CACHE, REDIS_LOCK, REDIS_SUB)

const s3Service = new AwsS3Service(AWS_S3)

// Auth ###############################################################
const jwtService = new JwtService(process.env.JWT_SECRET)
export const jwtStrategy = new JwtStrategy(commandBus)

const generateTokenHandler = new GenerateTokenHandler(jwtService)

const authCommandHandlers = [generateTokenHandler]

// Account ###############################################################
const accountFactory = new AccountFactory()
const accountRepository = new AccountRepository(DATABASE, accountFactory)

const createAccountHandler = new CreateAccountHandler(accountRepository, accountFactory)
const findAccountHandler = new FindAccountHandler(accountRepository)
const loginHandler = new LoginHandler(accountRepository, commandBus)
const logoutHandler = new LogoutHandler(accountRepository)
const updateAccountHandler = new UpdateAccountHandler(accountRepository)
const refreshTokenHandler = new RefreshTokenHandler(commandBus)

const accountCommandHandlers = [
  createAccountHandler,
  findAccountHandler,
  loginHandler,
  logoutHandler,
  updateAccountHandler,
  refreshTokenHandler
]
const accountQueryHandlers = []

// Article ###############################################################
const articleFactory = new ArticleFactory()
const articleRepository = new ArticleRepository(DATABASE, articleFactory)
const article_redisAdapter = new RedisAdapter(redisService)

const lookupArticleHandler = new LookupArticleHandler(
  articleRepository,
  article_redisAdapter
)
const createArticleHandler = new CreateArticleHandler(
  articleRepository,
  articleFactory,
  article_redisAdapter
)
const updateArticleHandler = new UpdateArticleHandler(
  articleRepository,
  article_redisAdapter
)
const deleteArticleHandler = new DeleteArticleHandler(
  articleRepository,
  article_redisAdapter
)

const findArticleAllHandler = new FindArticleAllHandler(DATABASE)
const findArticleDetailHandler = new FindArticleDetailHandler(DATABASE)
const findTagsHandler = new FindTagsHandler(DATABASE, article_redisAdapter)

const articleCommandHandlers = [
  lookupArticleHandler,
  createArticleHandler,
  updateArticleHandler,
  deleteArticleHandler
]
const articleQueryHandlers = [
  findArticleAllHandler,
  findArticleDetailHandler,
  findTagsHandler
]

// Comment ###############################################################
const commentFactory = new CommentFactory()
const commentRepository = new CommentRepository(DATABASE, commentFactory)

const createCommentHandler = new CreateCommentHandler(commentRepository, commentFactory)
const deleteCommentHandler = new DeleteCommentHandler(commentRepository)
const updateCommentHandler = new UpdateCommentHandler(commentRepository)

const findCommentHandler = new FindCommentHandler(DATABASE)

const commentCommandHandlers = [
  createCommentHandler,
  deleteCommentHandler,
  updateCommentHandler
]
const commentQueryHandlers = [findCommentHandler]

// Heart ###############################################################
const heartFactory = new HeartFactory()
const heartRepository = new HeartRepository(DATABASE, heartFactory)

const createHeartHandler = new CreateHeartHandler(heartRepository, heartFactory)
const deleteHeartHandler = new DeleteHeartHandler(heartRepository)

const findHeartHandler = new FindHeartHandler(DATABASE)

const heartCommandHandlers = [createHeartHandler, deleteHeartHandler]
const heartQueryHandlers = [findHeartHandler]

// Upload ###############################################################
const upload_amazonAdapter = new AmazonAdapter(s3Service)

const uploadHandler = new UploadHandler(upload_amazonAdapter)

const uploadCommandHandlers = [uploadHandler]

// Profile ###############################################################
const profileFactory = new ProfileFactory()
const profileRepository = new ProfileRepository(DATABASE, profileFactory)

const updateProfileHandler = new UpdateProfileHandler(profileRepository)
const findProfileHandler = new FindProfileHandler(DATABASE)

const profileCommandHandlers = [updateProfileHandler]
const profileQueryHandlers = [findProfileHandler]

// Controllers ###############################################################
const accountController = new AccountController(commandBus, queryBus, validationPipe)
const articleController = new ArticleController(commandBus, queryBus, validationPipe)
const commentController = new CommentController(commandBus, queryBus, validationPipe)
const heartController = new HeartController(commandBus, queryBus, validationPipe)
const uploadController = new UploadController(commandBus, validationPipe)
const profileController = new ProfileController(commandBus, queryBus, validationPipe)

// Register Handlers ###############################################################
commandBus.registerHandlers([
  ...authCommandHandlers,
  ...accountCommandHandlers,
  ...articleCommandHandlers,
  ...commentCommandHandlers,
  ...heartCommandHandlers,
  ...uploadCommandHandlers,
  ...profileCommandHandlers
])
queryBus.registerHandlers([
  ...accountQueryHandlers,
  ...articleQueryHandlers,
  ...commentQueryHandlers,
  ...heartQueryHandlers,
  ...profileQueryHandlers
])

const app = new App([
  accountController,
  articleController,
  commentController,
  heartController,
  uploadController,
  profileController
])

export default app
