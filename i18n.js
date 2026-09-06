
// 多语言支持与许可证管理
const I18n = {
    locale: 'zh-CN',
    translations: {
        'zh-CN': {
            score: '得分', lives: '生命', combo: '连击',
            disclaimer: '爱好者创作 · 与 Fruit Ninja 无关',
            welcome: '欢迎', editName: '修改昵称',
            freeMode: '自由模式', campaignMode: '闯关模式',
            viewLicense: '查看许可证', settings: '设置',
            particleEffect: '粒子效果', sound: '音效', close: '关闭',
            gameOver: '游戏结束', finalScore: '最终得分',
            retry: '再试一次', home: '返回主页',
            licenseTitle: '软件许可协议',
            exitToMenu: '退出游戏', exitTitle: '退出游戏',
            exitConfirm: '确定要退出当前游戏返回主菜单吗？\n当前进度将不会保存。',
            confirmExit: '确认退出', continueGame: '继续游戏'
        },
        'zh-TW': {
            score: '得分', lives: '生命', combo: '連擊',
            disclaimer: '愛好者創作 · 與 Fruit Ninja 無關',
            welcome: '歡迎', editName: '修改暱稱',
            freeMode: '自由模式', campaignMode: '闖關模式',
            viewLicense: '查看許可證', settings: '設置',
            particleEffect: '粒子效果', sound: '音效', close: '關閉',
            gameOver: '遊戲結束', finalScore: '最終得分',
            retry: '再試一次', home: '返回主頁',
            licenseTitle: '軟體許可協議',
            exitToMenu: '退出遊戲', exitTitle: '退出遊戲',
            exitConfirm: '確定要退出當前遊戲返回主選單嗎？\n當前進度將不會保存。',
            confirmExit: '確認退出', continueGame: '繼續遊戲'
        },
        'en': {
            score: 'SCORE', lives: 'LIVES', combo: 'COMBO',
            disclaimer: 'Fan Creation · Not affiliated with Fruit Ninja',
            welcome: 'Welcome', editName: 'Edit Name',
            freeMode: 'Free Mode', campaignMode: 'Campaign',
            viewLicense: 'View License', settings: 'Settings',
            particleEffect: 'Particles', sound: 'Sound', close: 'Close',
            gameOver: 'GAME OVER', finalScore: 'Final Score',
            retry: 'Retry', home: 'Home',
            licenseTitle: 'Software License',
            exitToMenu: 'Exit Game', exitTitle: 'Exit Game',
            exitConfirm: 'Are you sure you want to exit to menu?\nCurrent progress will not be saved.',
            confirmExit: 'Confirm Exit', continueGame: 'Continue'
        }
    },
    
    // 许可证全文存储（简中、繁中、英文）
    licenses: {
        'zh-CN': `FruitSlayer 软件许可协议

版权所有 (c) 2026 zhou38551。保留所有权利。

1. 授权范围
   本软件 "FruitSlayer" 仅供个人学习、研究和欣赏使用。未经作者书面同意，任何单位和个人不得将本软件用于商业目的（包括但不限于出售、广告植入、付费下载等）。

2. 知识产权声明
   - 代码部分：允许用户查看、修改源代码用于个人学习，但不得公开分发修改后的完整可执行版本。
   - 美术与音频：游戏中所有的美术设计（包括3D建模贴图、UI界面、粒子效果配置）、音效及音乐版权归作者所有，严禁提取、复制或用于其他项目。

3. 免责声明
   - 本游戏为爱好者创作（Fan Creation），与 "Fruit Ninja" 或其版权所有方无任何官方关联、赞助或认可关系。
   - 本软件按"原样"提供，不提供任何形式的明示或暗示担保。作者不对因使用本软件产生的任何数据丢失或设备损坏负责。

4. 版本说明
   - 当前版本：GitHub 开源版 (Open Source Edition)
   - 另有发布：秒哒版 (Miaoda Edition)

5. 联系方式
   如需商业授权或合作，请联系：metrosubway0903@qq.com。`,
        
        'zh-TW': `FruitSlayer 軟體許可協議

版權所有 (c) 2026 zhou38551。保留所有權利。

1. 授權範圍
   本軟體 "FruitSlayer" 僅供個人學習、研究和欣賞使用。未經作者書面同意，任何單位和個人不得將本軟體用於商業目的（包括但不限於出售、廣告植入、付費下載等）。

2. 知識產權聲明
   - 代碼部分：允許使用者查看、修改源代碼用於個人學習，但不得公開分發修改後的完整可執行版本。
   - 美術與音頻：遊戲中所有的美術設計（包括3D建模貼圖、UI界面、粒子效果配置）、音效及音樂版權歸作者所有，嚴禁提取、複製或用於其他項目。

3. 免責聲明
   - 本遊戲為愛好者創作（Fan Creation），與 "Fruit Ninja" 或其版權所有方無任何官方關聯、贊助或認可關係。
   - 本軟體按「原樣」提供，不提供任何形式的明示或暗示擔保。作者不對因使用本軟體產生的任何資料遺失或設備損壞負責。

4. 版本說明
   - 當前版本：GitHub 開源版 (Open Source Edition)
   - 另有發布：秒噠版 (Miaoda Edition)

5. 聯繫方式
   如需商業授權或合作，請聯繫：metrosubway0903@qq.com。`,
        
        'en': `FruitSlayer Software License Agreement

Copyright (c) 2026 zhou38551. All rights reserved.

1. Grant of License
   The software "FruitSlayer" is provided solely for personal learning, research, and appreciation purposes. Without the written consent of the author, no individual or entity may use this software for commercial purposes (including but not limited to sale, advertisement placement, paid downloads, etc.).

2. Intellectual Property Statement
   - Source Code: Users are permitted to view and modify the source code for personal study. However, publicly distributing modified, complete executable versions of the software is prohibited.
   - Art and Audio Assets: All copyrights to the artistic designs within the game (including 3D model textures, UI interfaces, particle effect configurations), sound effects, and music belong to the author. Extracting, copying, or using these assets in other projects is strictly forbidden.

3. Disclaimer
   - This game is a fan creation and is not officially affiliated with, sponsored by, or endorsed by "Fruit Ninja" or its copyright holders.
   - The software is provided "as is", without warranty of any kind, express or implied. The author shall not be held liable for any data loss or device damage resulting from the use of this software.

4. Version Info
   - Current Version: GitHub Open Source Edition
   - Also Available: Miaoda Edition

5. Contact
   For commercial licensing or collaboration inquiries, please contact: metrosubway0903@qq.com.`
    },

    init() {
        // 优先从本地存储加载语言设置
        let savedLang = localStorage.getItem('fs_lang');
        
        // 首次访问时自动检测浏览器语言
        if (!savedLang) {
            const browserLang = navigator.language || navigator.userLanguage || 'zh-CN';
            if (browserLang.startsWith('en')) {
                savedLang = 'en';
            } else if (browserLang.startsWith('zh-TW') || browserLang.startsWith('zh-HK')) {
                savedLang = 'zh-TW';
            } else {
                savedLang = 'zh-CN';
            }
        }
        
        this.setLocale(savedLang);
        
        // 绑定语言切换按钮
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止事件冒泡
                this.setLocale(btn.dataset.lang);
            });
        });
    },

    setLocale(lang) {
        if (!this.translations[lang]) return;
        this.locale = lang;
        try {
            localStorage.setItem('fs_lang', lang);
        } catch (e) {
            console.warn('无法保存语言设置到 localStorage');
        }
        
        // 更新所有带 data-i18n 属性的元素文本
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[lang][key]) {
                el.textContent = this.translations[lang][key];
            }
        });
        
        // 更新语言按钮激活状态
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    },

    getLicenseText() {
        return this.licenses[this.locale] || this.licenses['zh-CN'];
    }
};
