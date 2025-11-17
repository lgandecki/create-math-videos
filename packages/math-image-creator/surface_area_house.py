from manim import *

class SurfaceAreaHouse(Scene):
    def construct(self):
        # Title
        title = Text("Powierzchnia i Pole - Przykład Domu", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create house shape
        # Base rectangle (main house)
        house_base = Rectangle(width=4, height=3, color=BLUE)
        house_base.shift(DOWN * 0.5)
        
        # Roof triangle
        roof_points = [
            [-2.5, 1, 0],  # Left corner
            [2.5, 1, 0],   # Right corner
            [0, 3, 0]      # Top
        ]
        roof = Polygon(*roof_points, color=RED)
        
        # Door
        door = Rectangle(width=0.8, height=1.5, color=MAROON)
        door.shift(DOWN * 1.25)
        
        # Windows
        window1 = Square(side_length=0.8, color=TEAL)
        window1.shift(LEFT * 1.2 + UP * 0.2)
        window2 = Square(side_length=0.8, color=TEAL)
        window2.shift(RIGHT * 1.2 + UP * 0.2)
        
        # Group all house elements
        house = VGroup(house_base, roof, door, window1, window2)
        house.shift(LEFT * 3)
        
        # Draw the house
        self.play(
            Create(house_base),
            Create(roof)
        )
        self.play(
            Create(door),
            Create(window1),
            Create(window2)
        )
        self.wait(1)
        
        # Label for surface
        surface_label = Text("Powierzchnia", font_size=24, color=YELLOW)
        surface_label.next_to(house, DOWN, buff=0.5)
        self.play(Write(surface_label))
        
        # Highlight the surface
        self.play(
            house_base.animate.set_fill(BLUE, opacity=0.3),
            roof.animate.set_fill(RED, opacity=0.3),
            run_time=2
        )
        self.wait(1)
        
        # Show area calculation
        area_text = Text("Pole = długość × szerokość", font_size=36)
        area_text.shift(RIGHT * 2 + UP * 2)
        self.play(Write(area_text))
        
        # Create a grid to show area measurement
        grid = NumberPlane(
            x_range=[-1, 5, 1],
            y_range=[-1, 4, 1],
            x_length=6,
            y_length=5,
            background_line_style={
                "stroke_color": GREY,
                "stroke_width": 1,
                "stroke_opacity": 0.5,
            }
        )
        grid.shift(RIGHT * 2 + DOWN * 0.5)
        
        self.play(Create(grid), run_time=2)
        self.wait(1)
        
        # Create a simplified house on the grid
        simple_house = Rectangle(width=4, height=3, color=BLUE)
        simple_house.shift(RIGHT * 2 + DOWN * 0.5)
        self.play(Create(simple_house))
        
        # Show dimensions
        width_line = Line(
            simple_house.get_corner(DL),
            simple_house.get_corner(DR),
            color=GREEN
        )
        width_label = Text("4 m", font_size=24, color=GREEN)
        width_label.next_to(width_line, DOWN, buff=0.2)
        
        height_line = Line(
            simple_house.get_corner(DR),
            simple_house.get_corner(UR),
            color=GREEN
        )
        height_label = Text("3 m", font_size=24, color=GREEN)
        height_label.next_to(height_line, RIGHT, buff=0.2)
        
        self.play(
            Create(width_line),
            Write(width_label),
            Create(height_line),
            Write(height_label)
        )
        self.wait(1)
        
        # Calculate area
        calculation = MathTex("Pole = 4m \\times 3m = 12m^2", font_size=36)
        calculation.next_to(area_text, DOWN, buff=0.5)
        self.play(Write(calculation))
        
        # Fill the rectangle to show area
        self.play(simple_house.animate.set_fill(BLUE, opacity=0.5))
        
        # Show unit squares
        unit_squares = VGroup()
        for i in range(4):
            for j in range(3):
                square = Square(side_length=1, color=WHITE)
                square.set_stroke(width=1)
                square.shift(RIGHT * (i + 0.5) + DOWN * (j - 1) + DOWN * 0.5)
                unit_squares.add(square)
        
        self.play(Create(unit_squares), run_time=2)
        self.wait(1)
        
        # Count the squares
        count_text = Text("12 kwadratów jednostkowych", font_size=28, color=YELLOW)
        count_text.next_to(simple_house, DOWN, buff=1)
        self.play(Write(count_text))
        
        # Highlight connection
        connection_text = Text(
            "Powierzchnia to płaska część obiektu.\nPole to miara tej powierzchni!",
            font_size=32,
            color=ORANGE
        )
        connection_text.to_edge(DOWN)
        
        self.play(
            FadeOut(surface_label),
            FadeOut(count_text),
            Write(connection_text)
        )
        self.wait(3)
        
        # Final summary
        self.play(
            FadeOut(connection_text),
            FadeOut(area_text),
            FadeOut(calculation),
            FadeOut(width_line),
            FadeOut(width_label),
            FadeOut(height_line),
            FadeOut(height_label),
            FadeOut(unit_squares),
            FadeOut(grid),
            FadeOut(simple_house),
            run_time=2
        )
        
        summary = Text(
            "Powierzchnia domu = suma pól wszystkich ścian",
            font_size=36,
            color=GREEN
        )
        summary.shift(RIGHT * 2)
        self.play(Write(summary))
        self.wait(3)