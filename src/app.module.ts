import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { GraphQLJSON } from 'graphql-scalars';
import { HelloWorldModule } from './hello-world/hello-world.module';
import { ActivityLogConsumer } from './consumers/activity-log.consumer';
import { ActivityLogService } from './services/activity-log.service';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // resolvers: { JSON: GraphQLJSON },
    }),
    HelloWorldModule,
    CommonModule,
  ],
  controllers: [ ActivityLogConsumer ],
  providers: [ ActivityLogService ],
})
export class AppModule {}
