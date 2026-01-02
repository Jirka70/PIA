export function makeCreateProjectDb({
  suitableTranslator = null,
}: {
  suitableTranslator?: { id: string; name: string } | null;
} = {}) {
  const calls: any[] = [];

  const db = {
    calls,

    select(_projection?: any) {
      calls.push({ op: "select", projection: _projection });

      return {
        from(_table: any) {
          calls.push({ op: "from", table: _table });

          return {
            innerJoin(_table: any, _on: any) {
              calls.push({ op: "innerJoin", table: _table });

              return {
                where(_cond: any) {
                  calls.push({ op: "where", cond: _cond });

                  
                    return suitableTranslator
                    ? [suitableTranslator]
                    : [];
  
                },
              };
            },
          };
        },
      };
    },

    insert(table: any) {
        return {
            values(vals: any) {
                return {
                    returning() {
                        
                    }
                }
            }
        }
    }
  };

  return db;
}
