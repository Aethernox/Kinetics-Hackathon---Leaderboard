import type { CSSProperties } from 'react';
import { RANK_LABEL, initials } from './theme';
import type { HeroTeam, Rank } from './types';

/**
 * 2D podium used for: no WebGL, reduced motion, Low quality, the lazy-load
 * placeholder, and any 3D error. Swap it for your existing podium cards via
 * the `renderFallback` prop on <Hero3D />.
 */
export function HeroFallback2D({ teams }: { teams: HeroTeam[] }) {
  const order: Array<[HeroTeam | undefined, Rank]> = [
    [teams[1], 2],
    [teams[0], 1],
    [teams[2], 3],
  ];
  return (
    <div className="k-fb">
      {order.map(([team, rank]) =>
        team ? (
          <article key={team.id} className={`k-fb__card k-fb__card--r${rank}`} style={{ '--lift': rank === 1 ? '0px' : '36px' } as CSSProperties}>
            <header>
              <div className="k-fb__logo">{initials(team.name)}</div>
              <div className="k-fb__id">
                <h3>{team.name}</h3>
                <p>{team.institution}</p>
              </div>
              <span className="k-fb__rank">{RANK_LABEL[rank]}</span>
            </header>
            <div className="k-fb__score">
              {team.score.toLocaleString('en-US')}
              <small>PTS</small>
            </div>
            {team.metric && <footer>{team.metric}</footer>}
          </article>
        ) : null,
      )}
    </div>
  );
}
