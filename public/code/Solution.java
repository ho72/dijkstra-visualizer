import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.Comparator;
import java.util.PriorityQueue;

/** SWEA 1249 보급로: 도착할 칸의 복구 시간을 가중치로 사용한다. */
public class Solution {
    static final int INF = Integer.MAX_VALUE;
    static final int[] dr = {-1, 0, 1, 0};
    static final int[] dc = {0, 1, 0, -1};

    static class Cell {
        final int r, c, cost;
        Cell(int r, int c, int cost) {
            this.r = r;
            this.c = c;
            this.cost = cost;
        }
    }

    static int solve(int[][] map) {
        int N = map.length;
        int[][] dist = new int[N][N];
        PriorityQueue<Cell> pq = new PriorityQueue<>(
            Comparator.comparingInt(cell -> cell.cost));

        for (int[] row : dist) Arrays.fill(row, INF);
        dist[0][0] = 0;
        pq.offer(new Cell(0, 0, 0));

        while (!pq.isEmpty()) {
            Cell cur = pq.poll();
            if (cur.cost > dist[cur.r][cur.c]) continue;
            for (int d = 0; d < 4; d++) {
                int nr = cur.r + dr[d];
                int nc = cur.c + dc[d];
                if (nr < 0 || nr >= N || nc < 0 || nc >= N)
                    continue;
                int nextCost = cur.cost + map[nr][nc];
                if (nextCost < dist[nr][nc]) {
                    dist[nr][nc] = nextCost;
                    pq.offer(new Cell(nr, nc, nextCost));
                }
            }
        }
        return dist[N - 1][N - 1];
    }

    public static void main(String[] args) throws Exception {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        int T = Integer.parseInt(br.readLine().trim());
        StringBuilder result = new StringBuilder();
        for (int tc = 1; tc <= T; tc++) {
            int N = Integer.parseInt(br.readLine().trim());
            int[][] map = new int[N][N];
            for (int r = 0; r < N; r++) {
                String line = br.readLine().trim();
                for (int c = 0; c < N; c++) map[r][c] = line.charAt(c) - '0';
            }
            result.append('#').append(tc).append(' ').append(solve(map)).append('\n');
        }
        System.out.print(result);
    }
}
