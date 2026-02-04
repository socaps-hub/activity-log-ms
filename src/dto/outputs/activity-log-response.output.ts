import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ActivityLogRowDto } from './activity-log-row.output';

@ObjectType()
export class ActivityLogResponse {

  @Field(() => [ActivityLogRowDto])
  registros: ActivityLogRowDto[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  pageSize: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalRegistros: number;
}
