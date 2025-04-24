-- SQLite
SELECT c.* 
FROM clientes c 
JOIN aluguelDeLivros a 
ON a.cliente_id = c.id 
WHERE a.dt_devolucao > datetime('now')

DESCRIBE aluguelDeLivros;
