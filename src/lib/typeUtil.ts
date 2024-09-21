type Without<
  T,
  V,
  WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined | null> extends V
      ? never
      : Exclude<T[K], undefined | null> extends object
        ?
            | Without<Exclude<T[K], undefined | null>, V>
            | (T[K] & (undefined | null))
        : T[K];
  },
> = Pick<
  WithNevers,
  {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K;
  }[keyof WithNevers]
>;

type WithoutShallow<T, V> = Pick<
  T,
  {
    [K in keyof T]: Exclude<T[K], undefined | null> extends V ? never : K;
  }[keyof T]
>;

/**
 * 特定のオブジェクト型からメソッドを再帰的に除外した型を返します。
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepLiteral<T> = Without<T, Function>;

/**
 * 特定のオブジェクト型からメソッドを除外した型を返します。
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type Literal<T> = WithoutShallow<T, Function>;
