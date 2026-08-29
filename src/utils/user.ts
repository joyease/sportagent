/**
 * User helpers for mapping emails to default nicknames and persisting profile info.
 */

export const getUserNickname = (email: string | null | undefined): string => {
  if (!email) return 'Hermann';
  const cleanEmail = email.toLowerCase().trim();

  // Check if user set a custom nickname for this specific email
  const specificSaved = localStorage.getItem(`sportpal_nickname_${cleanEmail}`);
  if (specificSaved) {
    return specificSaved;
  }

  // Preset mapping requested by user:
  // hermann@trip.com -> Hermann
  // trial@trip.com   -> Tom
  // abc@trip.com     -> Annie
  if (cleanEmail === 'hermann@trip.com' || cleanEmail === 'hermanntalk@gmail.com') {
    return 'Hermann';
  }
  if (cleanEmail === 'trial@trip.com') {
    return 'Tom';
  }
  if (cleanEmail === 'abc@trip.com') {
    return 'Annie';
  }

  // Default fallback to capitalized name before '@'
  const prefix = cleanEmail.split('@')[0];
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
};

export const saveUserNickname = (email: string | null | undefined, newNick: string): void => {
  if (!email) return;
  const cleanEmail = email.toLowerCase().trim();
  localStorage.setItem(`sportpal_nickname_${cleanEmail}`, newNick);
  localStorage.setItem('sportpal_user_nickname_v1', newNick);
};
