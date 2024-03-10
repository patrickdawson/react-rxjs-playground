import {
  BehaviorSubject,
  Subject,
  combineLatest,
  distinctUntilChanged,
  map,
  filter,
  tap,
} from 'rxjs';

function App() {
  const messageBrokerListener$ = new BehaviorSubject('unavailable'); // "available" | "unavailable
  const connectionRequests$ = new Subject();

  const canConnect$ = combineLatest([connectionRequests$, messageBrokerListener$]).pipe(
    map(([connectionRequest, brokerAvailable]) => {
      if (connectionRequest === 'connect' && brokerAvailable === 'available') {
        return 'connect';
      } else if (connectionRequest === 'disconnect' || brokerAvailable === 'unavailable') {
        return 'disconnect';
      } else {
        return 'noop';
      }
    }),
    distinctUntilChanged(),
    filter((value) => value !== 'noop'),
  );

  canConnect$.subscribe({
    next: (value) => {
      console.log('canConnect$', value);
    },
  });

  return (
    <div>
      <section>
        <h1>Message-Broker Controls:</h1>
        <button onClick={() => messageBrokerListener$.next('available')}>Available</button>
        <button onClick={() => messageBrokerListener$.next('unavailable')}>Unavailable</button>
      </section>

      <section>
        <h1>Connection Controls:</h1>
        <button onClick={() => connectionRequests$.next('connect')}>Connect</button>
        <button onClick={() => connectionRequests$.next('disconnect')}>Disconnect</button>
      </section>
    </div>
  );
}

export default App;
