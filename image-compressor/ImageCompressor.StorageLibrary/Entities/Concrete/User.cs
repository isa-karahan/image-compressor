using System.Runtime.Serialization;
using ImageCompressor.StorageLibrary.Constants;
using ImageCompressor.StorageLibrary.Entities.Abstract;

namespace ImageCompressor.StorageLibrary.Entities.Concrete;

public sealed class User : BaseTableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime BirthDate { get; set; } = DateTime.UtcNow;
    public Gender Gender { get; set; }
    public Profession Occupation { get; set; }
    [IgnoreDataMember]
    public string FullName => $"{Name} {Surname}";
}
