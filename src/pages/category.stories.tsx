import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { CategoryPage } from './category';

function CategoryStory(): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/acai', { replace: true });
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/:category"
        element={<CategoryPage />}
      />
    </Routes>
  );
}

const meta = {
  title: 'Pages/Category',
  component: CategoryStory,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CategoryStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
