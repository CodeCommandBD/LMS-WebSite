export const ProfileInfo = ({ user }) => {
  return (
    <div className="space-y-2">
      <h1 className="text-lg font-semibold">
        {user.name || "No name available"}
      </h1>

      <p className="font-bold">
        Email:{" "}
        <span className="font-semibold text-blue-500">
          {user.email || "No email available"}
        </span>
      </p>

      <p className="font-bold">
        Role:{" "}
        <span className="font-semibold text-blue-500">
          {user.role || "No role available"}
        </span>
      </p>

      <p className="font-bold">
        Bio:{" "}
        <span className="font-semibold text-blue-500">
          {user.bio || "No bio available"}
        </span>
      </p>
    </div>
  );
};
