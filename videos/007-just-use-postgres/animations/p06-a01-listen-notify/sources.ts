/** Supplied pgx v5 examples, reformatted for the screen without changing behavior. */
export const listenerSource = `package main

import (
  "context"
  "log"
  "os"

  "github.com/jackc/pgx/v5"
)

func main() {
  ctx := context.Background()

  // Отдельное постоянное соединение для LISTEN
  conn, err := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
  if err != nil {
    log.Fatal(err)
  }
  defer conn.Close(ctx)

  _, err = conn.Exec(ctx, "LISTEN cache_invalidation")
  if err != nil {
    log.Fatal(err)
  }

  for {
    n, err := conn.WaitForNotification(ctx)
    if err != nil {
      log.Fatal(err)
    }
    log.Printf("канал %s: сбросить %s",
      n.Channel, n.Payload)
  }
}`;

export const producerSource = `func changePrice(
  ctx context.Context, pool *pgxpool.Pool,
  productID int64, price int,
) error {
  tx, err := pool.Begin(ctx)
  if err != nil {
    return err
  }
  defer tx.Rollback(ctx) // после Commit ничего не делает

  if _, err := tx.Exec(ctx,
    \`UPDATE products SET price = $1 WHERE id = $2\`,
    price, productID); err != nil {
    return err
  }

  // Параметры передаём через pg_notify
  if _, err := tx.Exec(ctx,
    \`SELECT pg_notify('cache_invalidation', $1)\`,
    "product:1"); err != nil {
    return err
  }

  return tx.Commit(ctx) // уведомление уйдёт только здесь
}`;
