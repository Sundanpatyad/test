
  exports.sanitizeUser = (user) => {
    return { id: user.id, role: user.role };
  };