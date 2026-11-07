# Запись и чтение с кворумом

Studio → P-02-Architecture → p02-a04-replica-quorum. Таймлайн CapCut 12:09:00–15:02:00, 5190 кадров при 30 fps. Озвучка в отдельной композиции включена. Воспроизвести аудиофрагмент из исходного WAV можно командой из корня проекта:

```sh
ffmpeg -n -ss 720 -i /Users/mdpopov/Movies/CapCut/cassandra_audio.WAV -t 173 -vn -c:a aac -b:a 160k apps/remotion/public/generated/009-cassandra-scylladb/quorum-excerpt.m4a
```

Чат 42 имеет реплики A/B/C в одном дата-центре. Блокноты показывают текст сообщения №107 перед правкой и после неё. В сцене с парами AB, AC и BC — альтернативы одного чтения, до согласования версий. Это сохраняет исходное состояние для каждого примера. Тайминг речи и состояния заданы в scene.ts.

Выбор координатора сверен с [документацией драйвера](https://apache.github.io/cassandra-java-driver/4.19.0/core/load_balancing/). Для уровней согласованности и пересечения наборов используется [документация Apache Cassandra](https://cassandra.apache.org/doc/stable/cassandra/architecture/dynamo.html#tunable-consistency).
