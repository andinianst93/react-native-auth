export type SignUpProps = {
  username: string;
  email: string;
  password: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export type Expense = {
  id: number;
  title: string;
  amount: number;
  date: string;
  user_id: number;
};
