#!/usr/bin/env bash
# =====================================================================
# 余烬法典 — 阿里云 ECS 静态站点部署脚本
#
# 站点是纯静态文件，不需要数据库或后端：把根目录同步到 ECS 的 Web 目录，
# 再用 nginx 托管即可。脚本不会写入任何凭据，认证完全依赖本机 ssh 配置
# （可使用 ~/.ssh/config 中已配置的别名，例如 ECS_HOST=aliyun-ecs）。
#
# 用法示例：
#   ECS_HOST=aliyun-ecs ./deploy/deploy.sh
#   ECS_HOST=1.2.3.4 ECS_USER=ecs-user ECS_DEST=/var/www/ashen-codex ./deploy/deploy.sh
#
# 可选参数：
#   --with-nginx   同时上传 nginx.conf 到服务器并重载 nginx（需要 sudo 权限）
#   --dry-run      只打印将要执行的命令，不实际传输
#
# 环境变量：
#   ECS_HOST   必填，ECS 公网 IP / 域名 / ssh 别名
#   ECS_USER   ssh 用户，默认 root
#   ECS_DEST   服务器上的站点目录，默认 /var/www/ashen-codex
#   SSH_OPTS   额外 ssh 参数，例如 "-i ~/.ssh/aliyun.pem -p 2222"
# =====================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WITH_NGINX=0
DRY=0
for arg in "$@"; do
  case "$arg" in
    --with-nginx) WITH_NGINX=1 ;;
    --dry-run)    DRY=1 ;;
    *) echo "未知参数: $arg" >&2; exit 2 ;;
  esac
done

: "${ECS_HOST:?请设置 ECS_HOST，例如 ECS_HOST=aliyun-ecs}"
ECS_USER="${ECS_USER:-root}"
ECS_DEST="${ECS_DEST:-/var/www/ashen-codex}"
SSH_OPTS="${SSH_OPTS:-}"
TARGET="${ECS_USER}@${ECS_HOST}"

command -v rsync >/dev/null 2>&1 || { echo "缺少 rsync，请先安装（macOS 自带）" >&2; exit 1; }
command -v ssh >/dev/null 2>&1 || { echo "缺少 ssh" >&2; exit 1; }
for f in index.html works.html work.html characters.html equipment.html lore.html about.html; do
  [ -f "$ROOT/$f" ] || { echo "站点文件缺失: $f" >&2; exit 1; }
done

echo "站点目录 : $ROOT"
echo "目标主机 : $TARGET"
echo "目标路径 : $ECS_DEST"
echo "提示：同步会覆盖目标目录中的同名文件，但不会删除其它文件（未使用 --delete）。"
echo

SSH_CMD=(ssh $SSH_OPTS "$TARGET")
RSYNC_SSH=(ssh $SSH_OPTS)

if [ "$DRY" -eq 1 ]; then
  echo "[dry-run] ${SSH_CMD[*]} mkdir -p $ECS_DEST"
  echo "[dry-run] rsync -avz -e '${RSYNC_SSH[*]}' $ROOT/ $TARGET:$ECS_DEST/"
  [ "$WITH_NGINX" -eq 1 ] && echo "[dry-run] 上传 nginx.conf 并 reload nginx"
  exit 0
fi

# 1. 确保目标目录存在（ECS_USER 需对该路径有写权限）
"${SSH_CMD[@]}" "mkdir -p '$ECS_DEST'"

# 2. 同步静态文件；排除部署脚本自身与本地临时文件
rsync -avz \
  -e "${RSYNC_SSH[*]}" \
  --exclude '.git/' --exclude 'deploy/' --exclude '.DS_Store' --exclude '_viewport.html' \
  "$ROOT/" "$TARGET:$ECS_DEST/"

# 3. 可选：安装 nginx 配置并重载
if [ "$WITH_NGINX" -eq 1 ]; then
  echo "上传 nginx 配置…"
  scp $SSH_OPTS "$ROOT/deploy/nginx.conf" "$TARGET:/tmp/ashen-codex.conf"
  "${SSH_CMD[@]}" "sudo cp /tmp/ashen-codex.conf /etc/nginx/conf.d/ashen-codex.conf && sudo nginx -t && sudo systemctl reload nginx"
fi

echo
echo "同步完成。若服务器上已配置 nginx 指向 $ECS_DEST，可直接访问 http://${ECS_HOST}/"
echo "若尚未配置：将 deploy/nginx.conf 复制到 /etc/nginx/conf.d/ 后执行 nginx -t && systemctl reload nginx"
echo "建议后续为该站点配置域名与 HTTPS（certbot / 阿里云证书）。"
