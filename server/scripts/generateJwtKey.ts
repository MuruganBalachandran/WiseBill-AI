// region imports
import crypto from 'crypto';
// endregion

// generate strong jwt key
const generateKey = () => {
  const key = crypto.randomBytes(64).toString('hex');
  console.log('\n--- STRONG JWT KEY ---');
  console.log(key);
  console.log('----------------------\n');
};

// call function
generateKey();
