// ============================================
// GitHub开源版 game.js - Open Source Edition
// ============================================
// 平台: GitHub Pages / 通用部署
// 版本: 1.0.1-open-source
// 特点: MIT开源协议，环境自动检测，完整标注
// GitHub: https://github.com/your-repo/fruit-slasher
// ============================================

/*
 * ========================================================
 * Fruit Slasher - 水果切切乐
 * MIT License
 * Copyright (c) 2024 Fruit Slasher Contributors
 * ========================================================
 * GitHub Repository: https://github.com/your-repo/fruit-slasher
 * Documentation: https://your-repo.github.io/fruit-slasher/
 * Issues: https://github.com/your-repo/fruit-slasher/issues
 * ========================================================
 */

// 注意：I18n 对象由 i18n.js 提供，请勿在此重复声明

const CONFIG = {
    gravity: 0.2,
    bladeLife: 8,
    baseSpawnRate: 50,
    fruits: [
        { type: 'apple', color: '#ff4d4d', sideColor: '#cc0000', score: 10, radius: 25 },
        { type: 'banana', color: '#ffe135', sideColor: '#ccad00', score: 15, radius: 20 },
        { type: 'watermelon', color: '#2ecc71', sideColor: '#27ae60', score: 20, radius: 30 },
        { type: 'orange', color: '#ff9f43', sideColor: '#e67e22', score: 10, radius: 22 },
        { type: 'bomb', color: '#333', sideColor: '#000', score: 0, radius: 28, isBomb: true }
    ]
};

const State = {
    mode: 'menu',
    isPlaying: false,
    score: 0,
    lives: 3,
    combo: 0,
    comboTimer: 0,
    level: 1,
    nickname: '',
    entities: [],
    particles: [],
    bladeTrail: [],
    lastTime: 0,
    spawnTimer: 0,
    gameTime: 0,
    settings: { particles: true, sound: true }
};

// DOM 元素引用
let canvas, ctx, ui;

function init() {
    // 获取 DOM 元素
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    
    ui = {
        score: document.getElementById('score-display'),
        lives: document.getElementById('lives-display'),
        combo: document.getElementById('combo-display'),
        menu: document.getElementById('menu-overlay'),
        pause: document.getElementById('pause-overlay'),
        finalScore: document.getElementById('final-score'),
        pauseTitle: document.getElementById('pause-title'),
        pauseExitBtn: document.getElementById('pause-exit-btn'),
        nickname: document.getElementById('player-nickname'),
        settingsModal: document.getElementById('settings-modal'),
        licenseModal: document.getElementById('license-modal'),
        licenseContent: document.getElementById('license-content'),
        exitBtn: document.getElementById('exit-game-btn'),
        versionDisplay: document.getElementById('version-display'),
        exitConfirmModal: document.getElementById('exit-confirm-modal'),
        exitConfirmYes: document.getElementById('exit-confirm-yes'),
        exitConfirmNo: document.getElementById('exit-confirm-no'),
        exitScoreInfo: document.getElementById('exit-score-info')
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    loadUserData();
    if (typeof I18n !== 'undefined' && I18n.init) {
        I18n.init();
    }
    setupInputs();
    setupMenu();
    requestAnimationFrame(gameLoop);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 确保 CSS 尺寸与画布尺寸一致
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
}

function loadUserData() {
    try {
        const saved = localStorage.getItem('fruitSlayerData');
        if (saved) {
            const data = JSON.parse(saved);
            State.nickname = data.nickname || generateNickname();
            State.settings = data.settings || State.settings;
        } else {
            State.nickname = generateNickname();
        }
    } catch (e) {
        State.nickname = generateNickname();
        console.warn('无法访问 localStorage，使用默认设置');
    }
    
    if (ui.nickname) ui.nickname.textContent = State.nickname;
    
    const particlesToggle = document.getElementById('toggle-particles');
    const soundToggle = document.getElementById('toggle-sound');
    if (particlesToggle) particlesToggle.checked = State.settings.particles;
    if (soundToggle) soundToggle.checked = State.settings.sound;
    
    // ====== GitHub开源版版本检测与显示 ======
    if (ui.versionDisplay) {
        if (window.location.hostname.includes('github') || window.location.protocol === 'file:') {
            ui.versionDisplay.textContent = "GitHub开源版 v1.0.1 (MIT)";
            console.log("🎮 GitHub开源版启动 - Fruit Slasher Open Source");
            console.log("📦 GitHub: https://github.com/your-repo/fruit-slasher");
        } else {
            ui.versionDisplay.textContent = "GitHub开源版 v1.0.1 (MIT)";
            console.log("🎮 GitHub开源版启动 (非GitHub部署)");
        }
    }
}

function saveUserData() {
    try {
        localStorage.setItem('fruitSlayerData', JSON.stringify({
            nickname: State.nickname,
            settings: State.settings
        }));
    } catch (e) {
        console.warn('无法保存到 localStorage');
    }
}

function generateNickname() {
    const fruits = ['苹果', '香蕉', '西瓜', '橙子'];
    return `${fruits[Math.floor(Math.random() * fruits.length)]}${Math.floor(Math.random()*900)+100}`;
}

// --- 输入控制 ---
let isDragging = false;
let lastPos = { x: 0, y: 0 };

function setupInputs() {
    const startDrag = (x, y) => {
        if (!State.isPlaying) return;
        isDragging = true;
        lastPos = { x, y };
        State.bladeTrail.push({ x, y, life: CONFIG.bladeLife });
    };
    
    const moveDrag = (x, y) => {
        if (!State.isPlaying || !isDragging) return;
        State.bladeTrail.push({ x, y, life: CONFIG.bladeLife });
        checkSlice(lastPos, { x, y });
        lastPos = { x, y };
    };
    
    const endDrag = () => { isDragging = false; };

    canvas.addEventListener('mousedown', e => startDrag(e.clientX, e.clientY));
    canvas.addEventListener('mousemove', e => moveDrag(e.clientX, e.clientY));
    canvas.addEventListener('mouseup', endDrag);
    canvas.addEventListener('mouseleave', endDrag);
    
    canvas.addEventListener('touchstart', e => { 
        if(State.isPlaying) e.preventDefault(); 
        const touch = e.touches[0];
        if (touch) startDrag(touch.clientX, touch.clientY); 
    }, { passive: false });
    
    canvas.addEventListener('touchmove', e => { 
        if(State.isPlaying) e.preventDefault(); 
        const touch = e.touches[0];
        if (touch) moveDrag(touch.clientX, touch.clientY); 
    }, { passive: false });
    
    canvas.addEventListener('touchend', endDrag);
    canvas.addEventListener('touchcancel', endDrag);
    
    // ESC 键退出游戏
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (State.isPlaying) {
                showExitConfirm();
            } else if (!ui.exitConfirmModal.classList.contains('hidden')) {
                hideExitConfirm();
            }
        }
    });
}

// --- 游戏实体类 ---
class Entity {
    constructor(x, y, vx, vy, typeConfig) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.type = typeConfig.type;
        this.color = typeConfig.color;
        this.sideColor = typeConfig.sideColor;
        this.radius = typeConfig.radius;
        this.isBomb = typeConfig.isBomb || false;
        this.score = typeConfig.score;
        this.rotation = Math.random() * Math.PI;
        this.rotSpeed = (Math.random() - 0.5) * 0.1;
        this.active = true;
        this.sliced = false;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += CONFIG.gravity;
        this.rotation += this.rotSpeed;
        
        if (this.y > canvas.height + 50) this.active = false;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        const thickness = 6;
        
        // 阴影
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        if (this.isBomb) {
            ctx.arc(5, 5, this.radius, 0, Math.PI*2);
        } else {
            ctx.arc(5, 5, this.radius, 0, Math.PI*2);
        }
        ctx.fill();
        
        if (this.isBomb) {
            // 绘制圆形炸弹
            ctx.fillStyle = this.sideColor;
            ctx.beginPath();
            ctx.arc(thickness/2, thickness/2, this.radius, 0, Math.PI*2);
            ctx.fill();
            
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2);
            ctx.fill();
            
            // 炸弹引线
            ctx.strokeStyle = '#8B4513';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(this.radius * 0.7, -this.radius * 0.7);
            ctx.quadraticCurveTo(this.radius * 1.2, -this.radius * 1.3, this.radius * 0.9, -this.radius * 1.5);
            ctx.stroke();
            
            // 火花
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(this.radius * 0.9, -this.radius * 1.5, 4, 0, Math.PI*2);
            ctx.fill();
            
            // TNT 文字
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('TNT', 0, 0);
        } else {
            // 绘制圆形水果
            ctx.fillStyle = this.sideColor;
            ctx.beginPath();
            ctx.arc(thickness/2, thickness/2, this.radius, 0, Math.PI*2);
            ctx.fill();
            
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI*2);
            ctx.fill();
            
            // 高光
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.beginPath();
            ctx.arc(-this.radius*0.3, -this.radius*0.3, this.radius*0.2, 0, Math.PI*2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        this.life = 1.0;
        this.color = color;
        this.size = Math.random() * 5 + 2;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.3;
        this.life -= 0.03;
    }
    
    draw(ctx) {
        if (!State.settings.particles) return;
        ctx.globalAlpha = Math.max(0, this.life);
        ctx.fillStyle = this.color;
        const s = this.size * Math.max(0, this.life);
        ctx.fillRect(this.x, this.y, s, s);
        ctx.globalAlpha = 1.0;
    }
}

// --- 游戏核心逻辑 ---
function checkSlice(p1, p2) {
    for (let i = State.entities.length - 1; i >= 0; i--) {
        const ent = State.entities[i];
        if (ent.sliced || !ent.active) continue;
        
        const dist = pointToLineDistance(ent.x, ent.y, p1.x, p1.y, p2.x, p2.y);
        if (dist < ent.radius) {
            sliceEntity(ent, i);
        }
    }
}

function pointToLineDistance(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = lenSq !== 0 ? dot / lenSq : -1;
    
    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function sliceEntity(ent, index) {
    ent.sliced = true;
    ent.active = false;
    
    for (let k = 0; k < 10; k++) {
        State.particles.push(new Particle(ent.x, ent.y, ent.color));
    }
    
    if (ent.isBomb) {
        State.lives--;
        updateUI();
        createFloatingText("BOOM!", ent.x, ent.y, '#ff0000');
        screenShake();
        
        if (State.lives <= 0) {
            gameOver();
        }
    } else {
        State.combo++;
        State.comboTimer = 60;
        const multiplier = State.combo > 10 ? 3 : (State.combo > 5 ? 2 : 1);
        State.score += ent.score * multiplier;
        updateUI();
        createFloatingText(`${ent.score * multiplier}`, ent.x, ent.y, '#fff');
    }
}

function createFloatingText(text, x, y, color) {
    const container = document.getElementById('floating-text-container');
    if (!container) return;
    
    const el = document.createElement('div');
    el.className = 'floating-text';
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.color = color;
    container.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

function screenShake() {
    canvas.style.transform = `translate(${Math.random()*10-5}px, ${Math.random()*10-5}px)`;
    setTimeout(() => {
        canvas.style.transform = 'none';
    }, 200);
}

function gameLoop(timestamp) {
    if (!State.lastTime) State.lastTime = timestamp;
    const dt = timestamp - State.lastTime;
    State.lastTime = timestamp;
    
    if (State.isPlaying) {
        update(dt);
        draw();
    }
    
    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // 使用 dt 计算生成间隔（毫秒）
    State.spawnTimer += dt;
    let spawnInterval = (CONFIG.baseSpawnRate - (State.level * 2)) * 16.67; // 转换为毫秒
    if (spawnInterval < 333) spawnInterval = 333; // 最少 1/3 秒
    
    if (State.spawnTimer > spawnInterval) {
        spawnEntity();
        State.spawnTimer = 0;
    }
    
    State.entities.forEach(ent => ent.update());
    State.entities = State.entities.filter(ent => ent.active);
    
    State.particles.forEach(p => p.update());
    State.particles = State.particles.filter(p => p.life > 0);
    
    State.bladeTrail.forEach(t => t.life--);
    State.bladeTrail = State.bladeTrail.filter(t => t.life > 0);
    
    if (State.comboTimer > 0) {
        State.comboTimer--;
    } else {
        State.combo = 0;
        updateUI();
    }
    
    State.gameTime += dt;
}

function spawnEntity() {
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = canvas.height + 50;
    const vx = (canvas.width / 2 - x) * 0.01 + (Math.random() - 0.5) * 2;
    const vy = -(Math.random() * 5 + 12 + (State.level * 0.5));
    
    let typeConfig;
    if (Math.random() < 0.15) {
        typeConfig = CONFIG.fruits.find(f => f.isBomb);
    } else {
        const fruitTypes = CONFIG.fruits.filter(f => !f.isBomb);
        typeConfig = fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
    }
    
    State.entities.push(new Entity(x, y, vx, vy, typeConfig));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    State.entities.forEach(ent => ent.draw(ctx));
    State.particles.forEach(p => p.draw(ctx));
    
    // 绘制刀光轨迹
    if (State.bladeTrail.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(State.bladeTrail[0].x, State.bladeTrail[0].y);
        for (let i = 1; i < State.bladeTrail.length; i++) {
            ctx.lineTo(State.bladeTrail[i].x, State.bladeTrail[i].y);
        }
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#fff';
        ctx.stroke();
        ctx.restore();
    }
}

function updateUI() {
    if (ui.score) ui.score.textContent = State.score;
    if (ui.lives) ui.lives.textContent = '❤'.repeat(Math.max(0, State.lives));
    if (ui.combo) ui.combo.textContent = State.combo > 1 ? `x${State.combo}` : '';
}

function startGame(mode) {
    State.mode = mode || 'classic';
    State.score = 0;
    State.lives = 3;
    State.combo = 0;
    State.comboTimer = 0;
    State.entities = [];
    State.particles = [];
    State.bladeTrail = [];
    State.gameTime = 0;
    State.level = 1;
    State.spawnTimer = 0;
    State.isPlaying = true;
    
    if (ui.menu) ui.menu.classList.add('hidden');
    if (ui.pause) ui.pause.classList.add('hidden');
    if (ui.exitConfirmModal) ui.exitConfirmModal.classList.add('hidden');
    if (ui.exitBtn) ui.exitBtn.style.display = 'flex';
    if (ui.exitBtn && typeof I18n !== 'undefined') {
        const locale = I18n.locale;
        ui.exitBtn.title = locale === 'en' ? 'Exit (ESC)' : 
                          locale === 'zh-TW' ? '退出 (ESC)' : '退出 (ESC)';
    }
    if (ui.pauseExitBtn) ui.pauseExitBtn.style.display = 'none';
    updateUI();
}

function gameOver() {
    State.isPlaying = false;
    if (ui.finalScore) ui.finalScore.textContent = State.score;
    if (ui.pauseTitle) {
        const locale = (typeof I18n !== 'undefined') ? I18n.locale : 'zh-CN';
        ui.pauseTitle.textContent = (locale === 'en') ? 'GAME OVER' : 
                                    (locale === 'zh-TW') ? '遊戲結束' : '游戏结束';
    }
    if (ui.pause) ui.pause.classList.remove('hidden');
    if (ui.exitBtn) ui.exitBtn.style.display = 'none';
    if (ui.pauseExitBtn) ui.pauseExitBtn.style.display = 'none';
}

function exitToMenu() {
    State.isPlaying = false;
    State.entities = [];
    State.particles = [];
    State.bladeTrail = [];
    if (ui.menu) ui.menu.classList.remove('hidden');
    if (ui.pause) ui.pause.classList.add('hidden');
    if (ui.settingsModal) ui.settingsModal.classList.add('hidden');
    if (ui.licenseModal) ui.licenseModal.classList.add('hidden');
    if (ui.exitConfirmModal) ui.exitConfirmModal.classList.add('hidden');
    if (ui.exitBtn) ui.exitBtn.style.display = 'none';
}

// 显示退出确认弹窗
function showExitConfirm() {
    if (!ui.exitConfirmModal) return;
    // 更新当前得分信息
    const locale = (typeof I18n !== 'undefined') ? I18n.locale : 'zh-CN';
    const scoreLabel = locale === 'en' ? 'Current Score' : 
                       locale === 'zh-TW' ? '當前得分' : '当前得分';
    if (ui.exitScoreInfo) {
        ui.exitScoreInfo.textContent = `${scoreLabel}: ${State.score}`;
    }
    ui.exitConfirmModal.classList.remove('hidden');
}

// 隐藏退出确认弹窗
function hideExitConfirm() {
    if (ui.exitConfirmModal) {
        ui.exitConfirmModal.classList.add('hidden');
    }
}

// --- 菜单与模态框设置 ---
function setupMenu() {
    document.querySelectorAll('.menu-buttons .glass-btn[data-mode]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            startGame(btn.dataset.mode);
        });
    });

    const licenseBtn = document.getElementById('show-license-btn');
    if (licenseBtn) {
        licenseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ui.licenseContent && typeof I18n !== 'undefined' && I18n.getLicenseText) {
                ui.licenseContent.textContent = I18n.getLicenseText();
            }
            if (ui.licenseModal) ui.licenseModal.classList.remove('hidden');
        });
    }
    
    const closeLicense = document.getElementById('close-license');
    if (closeLicense) {
        closeLicense.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ui.licenseModal) ui.licenseModal.classList.add('hidden');
        });
    }

    if (ui.exitBtn) {
        ui.exitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showExitConfirm();
        });
    }

    // 退出确认弹窗按钮
    if (ui.exitConfirmYes) {
        ui.exitConfirmYes.addEventListener('click', (e) => {
            e.stopPropagation();
            hideExitConfirm();
            exitToMenu();
        });
    }
    if (ui.exitConfirmNo) {
        ui.exitConfirmNo.addEventListener('click', (e) => {
            e.stopPropagation();
            hideExitConfirm();
        });
    }
    // 点击遮罩层关闭确认弹窗
    if (ui.exitConfirmModal) {
        ui.exitConfirmModal.addEventListener('click', (e) => {
            if (e.target === ui.exitConfirmModal) {
                hideExitConfirm();
            }
        });
    }

    // 暂停界面的"退出游戏"按钮
    if (ui.pauseExitBtn) {
        ui.pauseExitBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exitToMenu();
        });
    }

    const editNicknameBtn = document.getElementById('edit-nickname-btn');
    if (editNicknameBtn) {
        editNicknameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newName = prompt("New Name:", State.nickname);
            if (newName) {
                State.nickname = newName;
                if (ui.nickname) ui.nickname.textContent = newName;
                saveUserData();
            }
        });
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            startGame(State.mode);
        });
    }
    
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exitToMenu();
        });
    }

    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ui.settingsModal) ui.settingsModal.classList.remove('hidden');
        });
    }
    
    const closeSettings = document.getElementById('close-settings');
    if (closeSettings) {
        closeSettings.addEventListener('click', (e) => {
            e.stopPropagation();
            if (ui.settingsModal) ui.settingsModal.classList.add('hidden');
            saveUserData();
        });
    }
    
    const toggleParticles = document.getElementById('toggle-particles');
    if (toggleParticles) {
        toggleParticles.addEventListener('change', (e) => {
            State.settings.particles = e.target.checked;
            saveUserData();
        });
    }
    
    const toggleSound = document.getElementById('toggle-sound');
    if (toggleSound) {
        toggleSound.addEventListener('change', (e) => {
            State.settings.sound = e.target.checked;
            saveUserData();
        });
    }
}

// 在 DOM 加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
