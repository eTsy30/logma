'use client';
import React, { useState } from 'react';
import './page.scss';

const GlassDashboard: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [activeRoom, setActiveRoom] = useState('Living Room');
  const [thermostat, setThermostat] = useState(64);
  const [playing, setPlaying] = useState(false);

  const rooms = ['Living Room', 'Bedroom', 'Kitchen', 'Backyard', 'Garage'];

  const devices = [
    {
      id: 1,
      name: 'Gaabor Humidifier',
      type: 'humidifier',
      isOn: true,
      icon: '💨',
    },
    {
      id: 2,
      name: 'Amazon Echo Speaker',
      type: 'speaker',
      isOn: false,
      icon: '🔊',
    },
    { id: 3, name: 'Bardi Smart Lamp', type: 'lamp', isOn: true, icon: '💡' },
    { id: 4, name: 'Xiaomi Camera', type: 'camera', isOn: false, icon: '📹' },
  ];

  const powerData = [
    { month: 'Jan', value: 80 },
    { month: 'Feb', value: 65 },
    { month: 'Mar', value: 140, isCurrent: true },
    { month: 'Apr', value: 95 },
    { month: 'May', value: 110 },
    { month: 'Jun', value: 85 },
  ];

  return (
    <div className={`glass-app glass-app--${theme}`} data-theme={theme}>
      {/* Background Layer */}
      <div className="glass-app__bg">
        <img
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1920&q=80"
          alt="Modern interior"
          className="glass-app__bg-image"
        />
        <div className="glass-app__bg-overlay"></div>
      </div>

      {/* Header */}
      <header className="glass-header">
        <div className="glass-header__time">10:02 PM</div>
        <button
          className="glass-header__theme"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Main Dashboard */}
      <main className="glass-dashboard">
        {/* Left Sidebar */}
        <nav className="glass-sidebar">
          {['🏠', '📊', '⚡', '📷', '👤'].map((icon, i) => (
            <button
              key={i}
              className={`glass-sidebar__item ${i === 0 ? 'is-active' : ''}`}
            >
              <span>{icon}</span>
            </button>
          ))}
        </nav>

        {/* Content Grid */}
        <div className="glass-grid">
          {/* Lamp Card - Large */}
          <div className="glass-card glass-card--large">
            <div className="glass-card__header">
              <span className="glass-card__label">Device</span>
              <button className="glass-card__menu">•••</button>
            </div>
            <div className="glass-card__title">
              Lumineus LED Modern Standing Lamp
            </div>

            <div className="lamp-preview">
              <div className="lamp-preview__image">💡</div>
              <div className="lamp-preview__stats">
                <div className="lamp-stat">
                  <div className="lamp-stat__value">4 H 20 M</div>
                  <div className="lamp-stat__label">Time Usage</div>
                </div>
                <div className="lamp-stat">
                  <div className="lamp-stat__value">72 W</div>
                  <div className="lamp-stat__label">Energy Consumption</div>
                </div>
              </div>
            </div>

            <div className="lamp-controls">
              <div className="lamp-control">
                <label>On from</label>
                <select>
                  <option>06:00 PM</option>
                </select>
              </div>
              <div className="lamp-control">
                <label>Off at</label>
                <select>
                  <option>05:00 AM</option>
                </select>
              </div>
            </div>

            <div className="lamp-slider">
              <span>☀️</span>
              <input type="range" min="0" max="100" defaultValue="75" />
            </div>
          </div>

          {/* Power Consumption Chart */}
          <div className="glass-card glass-card--chart">
            <div className="glass-card__header">
              <span className="glass-card__title-sm">
                Power Consumption (kWh)
              </span>
            </div>
            <div className="chart-bars">
              {powerData.map((item, i) => (
                <div key={i} className="chart-bar">
                  <div
                    className={`chart-bar__fill ${item.isCurrent ? 'is-current' : ''}`}
                    style={{ height: `${(item.value / 170) * 100}%` }}
                  >
                    {item.isCurrent && (
                      <span className="chart-bar__value">{item.value}</span>
                    )}
                  </div>
                  <span className="chart-bar__label">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Thermostat */}
          <div className="glass-card glass-card--thermostat">
            <div className="glass-card__header">
              <span className="glass-card__label">Thermostat</span>
              <div className="thermostat-toggle">
                <input type="checkbox" defaultChecked id="thermo" />
                <label htmlFor="thermo"></label>
              </div>
            </div>

            <div className="thermostat-dial">
              <svg viewBox="0 0 100 100" className="thermostat-dial__svg">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="var(--brand-default)"
                  strokeWidth="8"
                  strokeDasharray="200 283"
                  strokeLinecap="round"
                  transform="rotate(135 50 50)"
                />
              </svg>
              <div className="thermostat-dial__value">
                <span>{thermostat}°</span>
                <small>(°Fahrenheit)</small>
              </div>
            </div>

            <div className="thermostat-controls">
              <button onClick={() => setThermostat((t) => t - 1)}>−</button>
              <button onClick={() => setThermostat((t) => t + 1)}>+</button>
            </div>

            <div className="thermostat-modes">
              {[
                { icon: '☀️', label: 'Hot', active: false },
                { icon: '🍃', label: 'Eco', active: true },
                { icon: '💨', label: 'Fan', active: false },
                { icon: '❄️', label: 'Cold', active: false },
              ].map((mode, i) => (
                <button
                  key={i}
                  className={`thermostat-mode ${mode.active ? 'is-active' : ''}`}
                >
                  <span>{mode.icon}</span>
                  <small>{mode.label}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="glass-stats">
            <div className="glass-card glass-card--stat">
              <div className="stat-label">Current Consumption</div>
              <div className="stat-value">1,5 kWh</div>
            </div>
            <div className="glass-card glass-card--stat">
              <div className="stat-label">Humidity</div>
              <div className="stat-value">48,2%</div>
            </div>
            <div className="glass-card glass-card--stat">
              <div className="stat-label">Temperature</div>
              <div className="stat-value">68°F</div>
            </div>
          </div>

          {/* Device Grid */}
          <div className="glass-devices">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`glass-card glass-card--device ${device.isOn ? 'is-on' : ''}`}
              >
                <div className="device-header">
                  <span className="device-icon">{device.icon}</span>
                  <div
                    className={`device-toggle ${device.isOn ? 'is-on' : ''}`}
                  >
                    <div className="device-toggle__knob"></div>
                  </div>
                </div>
                <div className="device-info">
                  <div className="device-name">{device.name.split(' ')[0]}</div>
                  <div className="device-type">
                    {device.name.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Music Player */}
          <div className="glass-card glass-card--player">
            <div className="player-track">
              <div className="player-track__info">
                <div className="player-track__artist">Ericdoa x Valorant</div>
                <div className="player-track__title">Greater Than One</div>
              </div>
            </div>
            <div className="player-progress">
              <div className="player-progress__bar">
                <div
                  className="player-progress__fill"
                  style={{ width: '35%' }}
                ></div>
              </div>
              <div className="player-progress__time">
                <span>0:34</span>
                <span>2:27</span>
              </div>
            </div>
            <div className="player-controls">
              <button>🔀</button>
              <button>⏮</button>
              <button
                className="player-controls__play"
                onClick={() => setPlaying(!playing)}
              >
                {playing ? '⏸' : '▶'}
              </button>
              <button>⏭</button>
              <button>🔊</button>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="glass-nav">
        {rooms.map((room) => (
          <button
            key={room}
            className={`glass-nav__item ${activeRoom === room ? 'is-active' : ''}`}
            onClick={() => setActiveRoom(room)}
          >
            {room}
          </button>
        ))}
        <button className="glass-nav__add">+</button>
      </nav>

      {/* Color Usage Guide */}
      <div
        className={`color-guide color-guide--${theme} ${theme === 'dark' ? 'is-visible' : ''}`}
      >
        <button
          className="color-guide__toggle"
          onClick={() =>
            document
              .querySelector('.color-guide')
              ?.classList.toggle('is-visible')
          }
        >
          🎨 Color Guide
        </button>

        <div className="color-guide__content">
          <h3>Как использовать цвета</h3>

          <div className="color-layer">
            <h4>Layer 1: Canvas (Фон)</h4>
            <div className="color-examples">
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--canvas-primary)' }}
                ></div>
                <code>--canvas-primary</code>
                <span>Основной фон страницы</span>
              </div>
            </div>
          </div>

          <div className="color-layer">
            <h4>Layer 2: Glass Surface (Карточки)</h4>
            <div className="color-examples">
              <div className="color-example">
                <div className="color-swatch glass-demo"></div>
                <code>--glass-bg</code>
                <span>Полупрозрачный фон карточек</span>
              </div>
            </div>
          </div>

          <div className="color-layer">
            <h4>Layer 3: Borders (Границы)</h4>
            <div className="color-examples">
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--border-default)' }}
                ></div>
                <code>--border-default</code>
                <span>Границы карточек</span>
              </div>
              <div className="color-example">
                <div className="color-swatch glass-border-demo"></div>
                <code>--glass-border</code>
                <span>Блик на стекле</span>
              </div>
            </div>
          </div>

          <div className="color-layer">
            <h4>Layer 4: Ink (Текст)</h4>
            <div className="color-examples">
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--ink-primary)' }}
                ></div>
                <code>--ink-primary</code>
                <span>Заголовки, цифры</span>
              </div>
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--ink-secondary)' }}
                ></div>
                <code>--ink-secondary</code>
                <span>Подписи, лейблы</span>
              </div>
            </div>
          </div>

          <div className="color-layer">
            <h4>Layer 5: Accent (Акценты)</h4>
            <div className="color-examples">
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--brand-default)' }}
                ></div>
                <code>--brand-default</code>
                <span>Активные элементы, графики</span>
              </div>
              <div className="color-example">
                <div
                  className="color-swatch"
                  style={{ background: 'var(--success)' }}
                ></div>
                <code>--success</code>
                <span>Включено, онлайн</span>
              </div>
            </div>
          </div>

          <div className="color-tips">
            <h4>💡 Принципы использования:</h4>
            <ul>
              <li>
                <strong>Glass эффект:</strong> backdrop-filter: blur(20px) +
                полупрозрачный фон
              </li>
              <li>
                <strong>Иерархия:</strong> Canvas → Glass → Border → Text →
                Accent
              </li>
              <li>
                <strong>Контраст:</strong> Текст всегда читается на glass-фоне
                (3:1+)
              </li>
              <li>
                <strong>Акценты:</strong> Используй brand-default для
                интерактивных элементов
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassDashboard;
