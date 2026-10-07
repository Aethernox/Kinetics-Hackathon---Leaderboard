import { Team, GoogleSheetConfig, TeamStatus, MetricType } from '../types/leaderboard';
import { INITIAL_TEAMS } from './mockData';

/**
 * Normalizes metric types for visual icon rendering
 */
function inferMetricType(label?: string): MetricType {
  if (!label) return 'lidar';
  const l = label.toLowerCase();
  if (l.includes('lidar') || l.includes('radar')) return 'lidar';
  if (l.includes('point cloud') || l.includes('pointcloud') || l.includes('depth')) return 'pointcloud';
  if (l.includes('neural') || l.includes('convergence') || l.includes('rl') || l.includes('loss')) return 'neural';
  if (l.includes('trajectory') || l.includes('path') || l.includes('mpc') || l.includes('motion')) return 'trajectory';
  if (l.includes('grid') || l.includes('alignment') || l.includes('map')) return 'grid';
  if (l.includes('optimization') || l.includes('rate') || l.includes('speed') || l.includes('throughput')) return 'optimization';
  if (l.includes('slam') || l.includes('visual') || l.includes('odometry') || l.includes('vslam')) return 'slam';
  return 'lidar';
}

/**
 * Normalizes status strings safely
 */
function normalizeStatus(status?: string): TeamStatus {
  if (!status) return 'ACTIVE';
  const s = status.trim().toUpperCase();
  if (s.includes('QUALIF')) return 'ACTIVE';
  if (s.includes('IN PROG') || s.includes('CALCULAT')) return 'CALCULATING...';
  if (s.includes('COOL') || s.includes('PAUSE')) return 'COOLDOWN';
  if (s.includes('OFFLINE') || s.includes('INACTIVE')) return 'OFFLINE';
  if (s.includes('DISQUALIF') || s.includes('DQ')) return 'DISQUALIFIED';
  return 'ACTIVE';
}

/**
 * Parses raw CSV text into array of object rows
 */
export function parseCSV(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r\n|\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return [];

  const parseRow = (text: string): string[] => {
    const row: string[] = [];
    let insideQuotes = false;
    let entry = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        row.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim().replace(/^"|"$/g, ''));
    return row;
  };

  const rawHeaderRow = parseRow(lines[0]);
  let headers = rawHeaderRow.map(h => h.trim().toLowerCase());
  let startIdx = 1;

  // Check if row 0 was actually data without headers
  const isRow0Header = headers.some(h => 
    h.includes('team') || h.includes('name') || h.includes('score') || h.includes('inst') || h.includes('rank') || h.includes('total')
  );

  if (!isRow0Header) {
    headers = rawHeaderRow.map((_, i) => String.fromCharCode(97 + i));
    startIdx = 0;
  }

  const rows: Record<string, string>[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const rowObj: Record<string, string> = {};
    headers.forEach((header, index) => {
      const val = values[index] !== undefined ? values[index] : '';
      rowObj[header] = val;
      const clean = header.replace(/[^a-z0-9]/g, '');
      if (clean) rowObj[clean] = val;
      const letter = String.fromCharCode(97 + index);
      rowObj[letter] = val;
      rowObj[`col_${index}`] = val;
    });
    if (Object.values(rowObj).some(v => v.length > 0)) {
      rows.push(rowObj);
    }
  }

  return rows;
}

/**
 * Parses Google Visualization (gviz) JSON response
 */
export function parseGvizResponse(jsonText: string): Record<string, string>[] {
  const match = jsonText.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
  const rawJson = match ? match[1] : jsonText;
  const data = JSON.parse(rawJson);

  if (!data.table || !data.table.rows) {
    throw new Error('Invalid Google Sheet GViz structure');
  }

  let headers = (data.table.cols || []).map((col: any) => (col.label || col.id || '').trim().toLowerCase());

  const hasNamedHeaders = headers.some(h => 
    h.includes('team') || h.includes('name') || h.includes('score') || h.includes('inst') || h.includes('rank') || h.includes('total') || h.includes('task')
  );

  let startRowIdx = 0;

  if (!hasNamedHeaders && data.table.rows.length > 0 && data.table.rows[0].c) {
    const firstRowValues = data.table.rows[0].c.map((cell: any) => {
      const val = cell ? (cell.f !== undefined ? cell.f : cell.v) : '';
      return String(val !== null && val !== undefined ? val : '').trim().toLowerCase();
    });

    const isFirstRowHeader = firstRowValues.some(v => 
      v.includes('team') || v.includes('name') || v.includes('score') || v.includes('inst') || v.includes('rank') || v.includes('total') || v.includes('penalty')
    );

    if (isFirstRowHeader) {
      headers = firstRowValues;
      startRowIdx = 1;
    }
  }

  const rows: Record<string, string>[] = [];

  for (let rIdx = startRowIdx; rIdx < data.table.rows.length; rIdx++) {
    const row = data.table.rows[rIdx];
    if (!row || !row.c) continue;
    const rowObj: Record<string, string> = {};

    row.c.forEach((cell: any, colIdx: number) => {
      const header = headers[colIdx] || `col_${colIdx}`;
      const val = cell ? (cell.v !== null && cell.v !== undefined ? cell.v : (cell.f !== undefined ? cell.f : '')) : '';
      const strVal = String(val !== null && val !== undefined ? val : '').trim();

      rowObj[header] = strVal;
      const cleanKey = header.replace(/[^a-z0-9]/g, '');
      if (cleanKey && cleanKey !== header) {
        rowObj[cleanKey] = strVal;
      }
      const letter = String.fromCharCode(97 + colIdx);
      rowObj[letter] = strVal;
      rowObj[`col_${colIdx}`] = strVal;
    });

    if (Object.values(rowObj).some(v => v.length > 0)) {
      rows.push(rowObj);
    }
  }

  return rows;
}

const INVALID_TEAM_NAMES = new Set([
  'female', 'male', 'gender', 'class level', 'class_level', 'major', 'extracurricular', 'extracurricular activity',
  'home state', 'home_state', 'freshman', 'sophomore', 'junior', 'senior', 'student', 'students',
  'team name', 'team_name', 'name', 'rank', 'status', 'total score', 'task score', 'score',
  'penalty', 'tasks completed', 'last updated', 'institute', 'institution', 'college',
  'university', 'total', 'average', 'avg', 'summary', 'count', 'n/a', 'na', 'null', 'undefined',
  'none', 'test', 'sample', 'header', 'points', 'pts'
]);

function isInvalidTeamName(name: string): boolean {
  if (!name || typeof name !== 'string') return true;
  const clean = name.trim().toLowerCase();
  if (clean.length < 2) return true;
  if (INVALID_TEAM_NAMES.has(clean)) return true;
  // Ignore student class levels e.g. "1. Freshman", "2. Sophomore", "3. Junior", "4. Senior"
  if (/^[0-9]+\.\s*(freshman|sophomore|junior|senior)/i.test(clean)) return true;
  // Ignore pure numbers or pure punctuation
  if (/^[^a-zA-Z0-9]+$/.test(clean) || /^[0-9]+$/.test(clean)) return true;
  return false;
}

/**
 * Finds key by prioritized exact match, clean match, or contains match
 */
function findValue(row: Record<string, string>, possibleKeys: string[]): string {
  // 1. Exact match
  for (const key of possibleKeys) {
    const k = key.toLowerCase().trim();
    for (const [rowKey, val] of Object.entries(row)) {
      if (rowKey.toLowerCase().trim() === k && val && val.trim().length > 0) {
        return val.trim();
      }
    }
  }
  // 2. Clean match without spaces
  for (const key of possibleKeys) {
    const k = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const [rowKey, val] of Object.entries(row)) {
      if (rowKey.toLowerCase().replace(/[^a-z0-9]/g, '') === k && val && val.trim().length > 0) {
        return val.trim();
      }
    }
  }
  // 3. Contains match
  for (const key of possibleKeys) {
    const k = key.toLowerCase().trim();
    for (const [rowKey, val] of Object.entries(row)) {
      if (rowKey.toLowerCase().includes(k) && val && val.trim().length > 0) {
        return val.trim();
      }
    }
  }
  return '';
}

/**
 * Normalizes raw sheet row data into structured Team objects
 */
export function normalizeSheetData(rawRows: Record<string, string>[], previousTeams: Team[] = []): Team[] {
  const previousMap = new Map<string, Team>();
  previousTeams.forEach(t => {
    previousMap.set(t.teamName.toLowerCase(), t);
    previousMap.set(t.id, t);
  });

  const parsedTeams: Team[] = [];

  rawRows.forEach((row, index) => {
    // 1. Team Name: Look for explicit semantic headers first
    let teamName = findValue(row, [
      'team name', 'team_name', 'teamname', 'team', 'participant', 'participants', 'squad', 'team/institution', 'team / institution'
    ]);

    // If still not found, check generic 'name' header only if it is not a survey column
    if (!teamName) {
      const candidateName = findValue(row, ['name']);
      if (candidateName && !isInvalidTeamName(candidateName)) {
        teamName = candidateName;
      }
    }

    // Validate team name strictly
    if (!teamName || isInvalidTeamName(teamName)) {
      return; // Skip invalid or survey rows (e.g. Male, Female, Freshman, Headers)
    }

    // 2. Institute
    let institution = findValue(row, [
      'institute', 'institution', 'college', 'university', 'org', 'organization', 'inst'
    ]);
    if (!institution || isInvalidTeamName(institution)) {
      institution = 'Autonomous Systems Lab';
    }

    // 3. Total Score
    const rawScore = findValue(row, [
      'total score', 'total_score', 'totalscore', 'final score', 'round score', 'score', 'points', 'total points', 'pts', 'round_score'
    ]);
    const cleanScoreStr = rawScore.replace(/,/g, '').replace(/[^0-9.-]/g, '');
    const scoreNum = cleanScoreStr !== '' && !isNaN(parseFloat(cleanScoreStr)) ? parseFloat(cleanScoreStr) : 0;

    // 4. Secondary Task Score, Penalty, Tasks Completed
    const taskScoreRaw = findValue(row, ['task score', 'task_score', 'taskscore']);
    const penaltyRaw = findValue(row, ['penalty', 'penalties', 'deduction']);
    const tasksCompletedRaw = findValue(row, ['tasks completed', 'tasks_completed', 'tasks', 'completed']);

    // 5. Dynamic Metric Label formulation
    const directMetric = findValue(row, ['metric', 'metrics', 'metrics / gain', 'telemetry', 'gain', 'accuracy', 'sensor']);
    let metricLabel = directMetric;

    if (!metricLabel) {
      const parts: string[] = [];
      if (tasksCompletedRaw && !isNaN(Number(tasksCompletedRaw.replace(/[^0-9]/g, '')))) {
        parts.push(`${tasksCompletedRaw.replace(/[^0-9]/g, '')} Tasks`);
      }
      if (taskScoreRaw && !isNaN(Number(taskScoreRaw.replace(/[^0-9.-]/g, '')))) {
        parts.push(`Task Score: ${taskScoreRaw}`);
      }
      if (penaltyRaw && penaltyRaw !== '0' && !isNaN(Number(penaltyRaw.replace(/[^0-9.-]/g, '')))) {
        parts.push(`(-${penaltyRaw} pen)`);
      }
      if (parts.length > 0) {
        metricLabel = parts.join(' • ');
      } else {
        metricLabel = `LiDAR / Sensor accuracy: ${(95 + (index % 5) * 0.9).toFixed(1)}%`;
      }
    }

    // 6. Rank & Rank Change
    const rawRank = findValue(row, ['rank', 'position', '#', 'pos', 'standing']);
    const rankNum = parseInt(rawRank.replace(/[^0-9]/g, ''), 10) || (index + 1);

    const statusRaw = findValue(row, ['status', 'state', 'condition']);
    const status = normalizeStatus(statusRaw);
    const round = findValue(row, ['round', 'rnd', 'stage']) || 'RND 4';
    const logo = findValue(row, ['logo', 'icon', 'image', 'avatar']);

    // Check previous standing to calculate real rank change
    const prev = previousMap.get(teamName.toLowerCase());
    const previousRank = prev ? prev.rank : rankNum;
    const previousScore = prev ? prev.score : scoreNum;

    const rankChangeRaw = findValue(row, ['rank change', 'change', 'delta', '+/-', 'rank_change']);
    let rankChange = 0;
    if (rankChangeRaw) {
      rankChange = parseInt(rankChangeRaw.replace(/[^0-9+-]/g, ''), 10) || 0;
    } else if (prev) {
      rankChange = prev.rank - rankNum;
    }

    const cleanTeamSlug = teamName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const teamId = `team-${cleanTeamSlug}-${index + 1}`;

    // Institution code: short abbreviation
    let institutionCode = institution;
    if (institution.length > 12) {
      if (institution.toLowerCase().includes('delhi') && institution.toLowerCase().includes('nit')) institutionCode = 'NIT Delhi';
      else if (institution.toLowerCase().includes('delhi') && institution.toLowerCase().includes('iit')) institutionCode = 'IIT Delhi';
      else if (institution.toLowerCase().includes('delhi') && institution.toLowerCase().includes('iiit')) institutionCode = 'IIIT Delhi';
      else if (institution.toLowerCase().includes('roorkee')) institutionCode = 'IIT Roorkee';
      else if (institution.toLowerCase().includes('pilani') || institution.toLowerCase().includes('bits')) institutionCode = 'BITS Pilani';
      else if (institution.toLowerCase().includes('vellore') || institution.toLowerCase().includes('vit')) institutionCode = 'VIT Vellore';
      else if (institution.toLowerCase().includes('manipal')) institutionCode = 'Manipal';
      else if (institution.toLowerCase().includes('hyderabad')) institutionCode = 'IIIT Hyd';
      else {
        institutionCode = institution.split(' ').map(w => w[0]).join('').slice(0, 5).toUpperCase();
      }
    }

    parsedTeams.push({
      id: teamId,
      rank: rankNum,
      previousRank,
      teamName: teamName.toUpperCase(),
      institution,
      institutionCode,
      logo: logo || undefined,
      score: scoreNum,
      previousScore,
      metricLabel,
      metricValue: metricLabel.match(/\d+(\.\d+)?%/)?.[0] || (tasksCompletedRaw ? `${tasksCompletedRaw} tasks` : undefined),
      metricType: inferMetricType(metricLabel),
      round,
      rankChange,
      status,
      lastUpdated: findValue(row, ['last updated', 'last_updated', 'updated', 'time']) || new Date().toISOString(),
      details: {
        accuracy: parseFloat(metricLabel.match(/\d+(\.\d+)?/)?.[0] || '96.5'),
        sensorHealth: status === 'ACTIVE' ? 'OPTIMAL (98%)' : status,
        algorithm: `${teamName} Core v4`
      }
    });
  });

  if (parsedTeams.length === 0) {
    return previousTeams.length > 0 ? previousTeams : INITIAL_TEAMS;
  }

  // Sort by score descending
  parsedTeams.sort((a, b) => b.score - a.score);

  // Recalculate ranks based on sorted scores
  return parsedTeams.map((team, idx) => {
    const finalRank = idx + 1;
    const prev = previousMap.get(team.teamName.toLowerCase());
    const rankDelta = prev ? prev.rank - finalRank : (team.rankChange || 0);
    return {
      ...team,
      rank: finalRank,
      previousRank: prev ? prev.rank : finalRank,
      rankChange: rankDelta
    };
  });
}

/**
 * Fetches Google Sheet data using best available endpoint
 */
export async function fetchGoogleSheetData(config: GoogleSheetConfig, previousTeams: Team[] = []): Promise<Team[]> {
  const { sheetId, sheetName, apiKey } = config;

  if (!sheetId || sheetId.trim().length === 0) {
    throw new Error('Google Sheet ID is required.');
  }

  // Option A: If Google Sheets API Key provided, use official Google Sheets v4 API
  if (apiKey && apiKey.trim().length > 0) {
    const range = encodeURIComponent(sheetName ? `${sheetName}!A1:Z100` : 'A1:Z100');
    const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error(`Google API error (${res.status}): ${res.statusText}`);
    }
    const json = await res.json();
    const rows: string[][] = json.values || [];
    if (rows.length < 2) return previousTeams.length > 0 ? previousTeams : INITIAL_TEAMS;
    
    const headers = rows[0].map(h => h.toLowerCase().trim());
    const mappedRows: Record<string, string>[] = [];
    for (let i = 1; i < rows.length; i++) {
      const rowObj: Record<string, string> = {};
      headers.forEach((h, colIdx) => {
        rowObj[h] = rows[i][colIdx] || '';
        const clean = h.replace(/[^a-z0-9]/g, '');
        if (clean) rowObj[clean] = rows[i][colIdx] || '';
        const letter = String.fromCharCode(97 + colIdx);
        rowObj[letter] = rows[i][colIdx] || '';
        rowObj[`col_${colIdx}`] = rows[i][colIdx] || '';
      });
      mappedRows.push(rowObj);
    }
    return normalizeSheetData(mappedRows, previousTeams);
  }

  // Option B: Use Google Visualization API (GViz) which works on any public / shared sheet without API Key
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : ''}&tq=${encodeURIComponent('select *')}&_t=${Date.now()}`;
  
  try {
    const gvizRes = await fetch(gvizUrl, { headers: { 'Cache-Control': 'no-cache' } });
    if (gvizRes.ok) {
      const text = await gvizRes.text();
      const parsedRows = parseGvizResponse(text);
      if (parsedRows.length > 0) {
        return normalizeSheetData(parsedRows, previousTeams);
      }
    }
  } catch (gvizError) {
    console.warn('GViz endpoint failed, attempting public CSV export fallback...', gvizError);
  }

  // Option C: Use Public CSV Export fallback
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : ''}&_t=${Date.now()}`;
  const csvRes = await fetch(csvUrl, { headers: { 'Cache-Control': 'no-cache' } });
  if (!csvRes.ok) {
    throw new Error(`Failed to access Google Sheet (${csvRes.status}). Verify that the sheet is shared as "Anyone with the link can view".`);
  }
  const csvText = await csvRes.text();
  const parsedRows = parseCSV(csvText);
  if (parsedRows.length === 0) {
    throw new Error('Google Sheet returned 0 rows or is empty.');
  }

  return normalizeSheetData(parsedRows, previousTeams);
}

