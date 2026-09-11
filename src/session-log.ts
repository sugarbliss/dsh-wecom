import type { SessionEvent } from '@deepseek-ai/dsh-session'

/**
 * Structural view of a harness session's event log.
 *
 * `@deepseek-ai/dsh-session` 0.1.0-rc.x exposes the log as the `events` getter;
 * 0.1.5-rc.x REMOVED that getter in favour of `snapshotEvents()` (the whole log
 * when called without arguments), `ownEvents()` and `eventAt(seq)`. `seq` still
 * means "the log length" in both generations, and every accessor returns the
 * same deeply frozen events, so this view lets the plugin read one log on both.
 */
export interface SessionLogLike {
  /** Next event sequence number — always the log length. */
  readonly seq?: number
  /** 0.1.0-rc.x event log. */
  readonly events?: readonly SessionEvent[]
  /** 0.1.5-rc.x log accessor; a half-open `[fromSeq, toSeqExclusive)` range. */
  snapshotEvents?(fromSeq?: number, toSeqExclusive?: number): readonly SessionEvent[]
}

/** The session's whole event log, on either side of the 0.1.5 API change. */
export function sessionLog(session: SessionLogLike): readonly SessionEvent[] {
  if (typeof session.snapshotEvents === 'function') return session.snapshotEvents()
  return session.events ?? []
}

/** The session log from `fromSeq` (an index into the log) to its end. */
export function sessionLogFrom(session: SessionLogLike, fromSeq: number): readonly SessionEvent[] {
  if (typeof session.snapshotEvents === 'function') return session.snapshotEvents(fromSeq)
  return (session.events ?? []).slice(fromSeq)
}

/** The log length — the index one past the last event. */
export function sessionLogLength(session: SessionLogLike): number {
  const seq = session.seq
  if (typeof seq === 'number') return seq
  return session.events?.length ?? 0
}
