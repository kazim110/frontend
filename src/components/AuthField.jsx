function AuthField({ label, name, type = 'text', value, onChange, autoComplete }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required
      />
    </label>
  )
}

export default AuthField
