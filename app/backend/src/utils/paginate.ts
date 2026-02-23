import { Prisma } from '@prisma/client'

export interface PaginationParams<T> {
  page?: number
  limit?: number
  where?: Prisma.Args<T, 'findMany'>['where']
  orderBy?: Prisma.Args<T, 'findMany'>['orderBy']
  include?: Prisma.Args<T, 'findMany'>['include']
  select?: Prisma.Args<T, 'findMany'>['select']
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function paginate<
  ModelDelegate extends {
    findMany: Function
    count: Function
  },
  T
>(
  model: ModelDelegate,
  params: PaginationParams<ModelDelegate>
): Promise<PaginatedResponse<T>> {

  const {
    page = 1,
    limit = 10,
    where,
    orderBy,
    include,
    select
  } = params

  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    model.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include,
      select
    }),
    model.count({ where })
  ])

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }
}