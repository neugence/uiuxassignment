import { useGetUsersQuery } from "../redux/baseApi/baseApi";

const Members = () => {
  const { data: members, isLoading, error } = useGetUsersQuery();

  if (error)
    return <p className="text-center text-red-500">Error fetching members</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 pb-10 h-screen">
      <h2 className="text-3xl font-bold text-center text-purple-800 mb-6">
         Members: {members?.length}
      </h2>
      {members?.length === 0 ? (
        <p className="text-center text-gray-500">No members found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full border-collapse">
            <thead className="bg-purple-700 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Profile</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {members?.map((member, index) => (
                <tr
                  key={member.email}
                  className={`border-b border-gray-300 ${
                    index % 2 === 0 ? "bg-purple-50" : "bg-white"
                  }`}
                >
                  <td className="py-4 px-6">
                    <img
                      src={member?.imageURL}
                      alt={member.name}
                      className="w-14 h-14 rounded-full shadow-md"
                    />
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-700">
                    {member.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Members;
