import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t bg-primary text-primary-foreground">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <h3 className="font-display text-lg font-bold">
            KPBF <span className="text-accent">REC</span>
          </h3>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Онлайн-база данных казахстанского профессионального бокса.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Разделы</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/fighters" className="hover:text-accent transition-colors">Боксёры</Link></li>
            <li><Link to="/fights" className="hover:text-accent transition-colors">Бои</Link></li>
            <li><Link to="/events" className="hover:text-accent transition-colors">События</Link></li>
            <li><Link to="/rankings" className="hover:text-accent transition-colors">Рейтинги</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Информация</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/news" className="hover:text-accent transition-colors">Новости</Link></li>
            <li><a href="#" className="hover:text-accent transition-colors">О проекте</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Контакты</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Язык</h4>
          <ul className="mt-3 space-y-2 text-sm text-primary-foreground/70">
            <li><button className="hover:text-accent transition-colors">Русский</button></li>
            <li><button className="hover:text-accent transition-colors">Қазақша</button></li>
            <li><button className="hover:text-accent transition-colors">English</button></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
        © {new Date().getFullYear()} KPBF REC. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
