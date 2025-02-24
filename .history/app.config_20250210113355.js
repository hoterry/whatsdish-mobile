// app.config.js
export default ({ config }) => {
    const isDev = process.env.NODE_ENV === 'development';
  
    const devEnv = {
      API_URL: 'http://localhost:5000',
      SUPABASE_URL: 'https://kaogouzfrzjeynyflmrr.supabase.co',
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb2dvdXpmcnpqZXlueWZsbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjUyNzQsImV4cCI6MjA0OTI0MTI3NH0.Bp75Wx3ZruXhkw6W8vh6J3FtjFyy4QSY3t8_aaGyG90',
    };
  
    const prodEnv = {
      API_URL: 'http://localhost:5000',
      SUPABASE_URL: 'https://kaogouzfrzjeynyflmrr.supabase.co',
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthb2dvdXpmcnpqZXlueWZsbXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2NjUyNzQsImV4cCI6MjA0OTI0MTI3NH0.Bp75Wx3ZruXhkw6W8vh6J3FtjFyy4QSY3t8_aaGyG90',
    };
  
    const env = isDev ? devEnv : prodEnv;
  
    return {
      ...config,
      extra: {
        ...config.extra,
        ...env,
      },
    };
  };