# 現在の時刻を変数に入れる
now=$(date "+%Y-%m-%d %H:%M")

git add .
# メッセージに自動で時刻を入れる
git commit -m "$now update"
git push origin main