const app = require('./app');

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Mini Image Gallery backend listening on port ${PORT}`);
});
