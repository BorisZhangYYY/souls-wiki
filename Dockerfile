# 余烬法典 — 容器部署（可选方案，替代 rsync + 宿主机 nginx）
# 构建：docker build -t ashen-codex .
# 运行：docker run -d --name ashen-codex -p 80:80 --restart unless-stopped ashen-codex
# 若 80 端口已被占用，可改为 -p 8080:80 并自行反代。
FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
