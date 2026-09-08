import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Queue;

/** SWEA 1249 보급로: 도착할 칸의 복구 시간을 가중치로 사용한다. */
public class Solution {
    static int solve(int[][] map) {
        int N = map.length;
        int[] dx = {-1, 1, 0, 0};
        int[] dy = {0, 0, -1, 1};
        Queue<int[]> pq = new PriorityQueue<>(
            (a, b) -> Integer.compare(a[2], b[2]));
        int[][] minCost = new int[N][N];
        for (int i = 0; i < N; i++) {
            Arrays.fill(minCost[i], Integer.MAX_VALUE);
        }
        minCost[0][0] = 0;
        pq.offer(new int[] {0, 0, 0});

        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currentX = current[0];
            int currentY = current[1];
            int currentCost = current[2];
            if (currentCost > minCost[currentX][currentY]) {
                continue;
            }
            if (currentX == N - 1 && currentY == N - 1) {
                break;
            }
            for (int dir = 0; dir < 4; dir++) {
                int nextX = currentX + dx[dir];
                int nextY = currentY + dy[dir];
                if (nextX < 0 || nextX >= N ||
                    nextY < 0 || nextY >= N) {
                    continue;
                }
                int cost = map[nextX][nextY];
                int newDistance = currentCost + cost;
                if (newDistance < minCost[nextX][nextY]) {
                    minCost[nextX][nextY] = newDistance;
                    pq.offer(new int[] {nextX, nextY, newDistance});
                }
            }
        }
        return minCost[N - 1][N - 1];
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
