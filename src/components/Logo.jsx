export default function Logo() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt=""
      width="28"
      height="28"
      aria-hidden="true"
    />
  );
}
