# Настройка GitHub репозитория

## Создание репозитория на GitHub

1. **Перейдите на GitHub.com**
2. **Нажмите "New repository"**
3. **Заполните поля:**
   - Repository name: `Snake-Game-in-JS`
   - Description: `Modern Snake Game with React, power-ups and glitch effects`
   - Visibility: Public
   - НЕ добавляйте README, .gitignore или лицензию (они уже есть)

## Подключение локального репозитория к GitHub

```bash
# Добавьте remote origin (замените YOUR_USERNAME на ваш GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Snake-Game-in-JS.git

# Переименуйте ветку в main (современный стандарт)
git branch -M main

# Отправьте код на GitHub
git push -u origin main
```

## Альтернативный способ через GitHub CLI

```bash
# Если у вас установлен GitHub CLI
gh repo create Snake-Game-in-JS --public --source=. --remote=origin --push
```

## Проверка

После выполнения команд:
- Код будет загружен на GitHub
- README.md отобразится на главной странице репозитория
- GAME_MECHANICS.md будет доступен в репозитории
- Иконка змеи будет отображаться во вкладке браузера

## Дополнительные настройки

### GitHub Pages (опционально)
Для автоматического деплоя на GitHub Pages:

1. Перейдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, folder: / (root)
4. После сборки: `npm run build`
5. Скопируйте содержимое папки `build` в корень репозитория
6. Создайте коммит и пуш

### Настройка темы репозитория
В Settings → General → Theme color: `#000000` (черная тема)
