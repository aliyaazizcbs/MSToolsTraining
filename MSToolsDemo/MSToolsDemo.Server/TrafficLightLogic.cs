public static class TrafficLightLogic
{
    // TODO: The states below are in the WRONG order — that's why the light is broken!
    // Can you rearrange these 4 items so the traffic light follows the correct UK sequence?
    // Hint: Think about what a real traffic light does after Red before it goes Green...
    private static readonly string[] _sequence = ["red", "green", "amber", "red-amber"];

    public static string GetNextLight(string current)
    {
        var index = Array.IndexOf(_sequence, current);
        if (index == -1) return "red";
        return _sequence[(index + 1) % _sequence.Length];
    }
}
