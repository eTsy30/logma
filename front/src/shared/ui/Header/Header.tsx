import s from './Header.module.scss';
import IdeaIcon from '../../../../public/icons/Idea.svg';

export const Header = () => {
  return (
    <header className={s.header}>
      <h1 className={s.logo}>
        L
        <span className={s.idea}>
          <IdeaIcon />
        </span>
        gma
      </h1>
    </header>
  );
};
