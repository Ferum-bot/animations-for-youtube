import React from 'react';
import {CodeEditor, type CodeLine} from '@channel/motion-v2';
import {tables, type Table} from './schema';

const layout = {
  users: 'compact', accounts: 'standard', symbols: 'compact',
  orders: 'wide', executions: 'standard', positions: 'standard',
} as const satisfies Record<Table, React.ComponentProps<typeof CodeEditor>['layout']>;

function listing(table: Table): CodeLine[] {
  const {columns} = tables[table];
  const fieldWidth = Math.max(...columns.map(([field]) => field.length)) + 1;
  const lines: CodeLine[] = [{text: `CREATE TABLE ${table} (`, field: null}];
  columns.forEach(([field, type, comment], index) => {
    const comma = index < columns.length - 1 || table === 'positions' ? ',' : '';
    const note = comment ? `  -- ${comment}` : '';
    lines.push({field, text: `  ${field.padEnd(fieldWidth)}${type}${comma}${note}`});
  });
  if (table === 'positions') lines.push({field: null, text: '  PRIMARY KEY (account_id, ticker)'});
  lines.push({field: null, text: ');'});
  return lines;
}

export const SqlEditor = ({table, fieldStrength}: {
  readonly table: Table;
  readonly fieldStrength: (field: string) => number;
}) => <CodeEditor lines={listing(table)} layout={layout[table]} scale={1.18} minimumTop={404}
  fieldStrength={fieldStrength}/>;
