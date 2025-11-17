from manim import *

class PercentsPerHundreds(Scene):
    def construct(self):
        # Title
        title = Text("Procenty = \"Na Sto\"", font_size=48)
        subtitle = Text("Procenty to po prostu ułamki o mianowniku 100", font_size=24)
        subtitle.next_to(title, DOWN)
        
        self.play(Write(title))
        self.play(FadeIn(subtitle))
        self.wait(2)
        self.play(FadeOut(title, subtitle))

        # Battery example
        self.battery_example()
        self.wait()
        
        # Clear scene
        self.play(*[FadeOut(mob) for mob in self.mobjects])
        
        # Sale example
        self.sale_example()
        self.wait(3)

    def battery_example(self):
        # Battery icon
        battery_outline = Rectangle(width=3, height=1.5, stroke_width=3)
        battery_cap = Rectangle(width=0.2, height=0.8, fill_color=WHITE, fill_opacity=1, stroke_width=0)
        battery_cap.next_to(battery_outline, RIGHT, buff=0)
        battery = VGroup(battery_outline, battery_cap).shift(LEFT * 3.5 + UP * 2)
        
        # Battery fill at 100%
        battery_fill = Rectangle(width=2.9, height=1.4, fill_color=GREEN, fill_opacity=0.8, stroke_width=0)
        battery_fill.move_to(battery_outline.get_center())
        
        # Grid of 100 squares
        grid = self.create_grid(10, 10, 0.3).shift(RIGHT * 2 + UP * 2)
        
        # Color all squares green initially
        for square in grid:
            square.set_fill(GREEN, opacity=0.8)
        
        # Labels
        battery_label = Text("100%", font_size=24).next_to(battery, DOWN)
        grid_label = Text("100%", font_size=24).next_to(grid, DOWN)
        
        self.play(
            Create(battery),
            FadeIn(battery_fill),
            Create(grid),
            Write(battery_label),
            Write(grid_label)
        )
        self.wait(2)

        # Animate battery usage to 75%
        new_battery_fill = Rectangle(width=2.175, height=1.4, fill_color=GREEN, fill_opacity=0.8, stroke_width=0)
        new_battery_fill.align_to(battery_outline, LEFT).shift(RIGHT * 0.05)
        
        minus_text = Text("-25%", font_size=32, color=RED).next_to(battery, UP)
        
        # Change 25 squares to gray
        squares_to_gray = []
        for i in range(25):
            row = i // 10
            col = i % 10
            square_index = (9 - row) * 10 + col  # Bottom to top
            squares_to_gray.append(square_index)
        
        gray_animations = []
        for idx in squares_to_gray:
            gray_animations.append(grid[idx].animate.set_fill(GRAY, opacity=0.5))
        
        self.play(
            Transform(battery_fill, new_battery_fill),
            FadeIn(minus_text),
            *gray_animations
        )
        
        # Update labels
        new_battery_label = Text("75%", font_size=24).next_to(battery, DOWN)
        new_grid_label = Text("75%", font_size=24).next_to(grid, DOWN)
        
        self.play(
            Transform(battery_label, new_battery_label),
            Transform(grid_label, new_grid_label),
            FadeOut(minus_text)
        )
        
        # Add brace connecting battery level to grid
        brace = Brace(VGroup(new_battery_fill, grid[:75]), direction=DOWN, buff=0.8)
        brace_text = Text("75 z 100 kwadratów", font_size=18)
        brace_text.next_to(brace, DOWN)
        
        self.play(
            Create(brace),
            Write(brace_text)
        )
        self.wait(2)

    def sale_example(self):
        # Price tag
        price_tag = VGroup(
            Rectangle(width=3, height=1.5, fill_color=WHITE, fill_opacity=1),
            Text("300 zł", font_size=36, color=BLACK)
        )
        price_tag[1].move_to(price_tag[0].get_center())
        price_tag = VGroup(*price_tag).shift(LEFT * 3.5)
        
        # Sale banner
        sale_banner = VGroup(
            Rectangle(width=2.5, height=1, fill_color=RED, fill_opacity=0.9),
            Text("-20%", font_size=32, color=WHITE)
        )
        sale_banner[1].move_to(sale_banner[0].get_center())
        sale_banner = VGroup(*sale_banner).move_to(price_tag).shift(UP * 0.3 + RIGHT * 0.3)
        
        self.play(
            FadeIn(price_tag),
            FadeIn(sale_banner, shift=DOWN * 0.5)
        )
        self.wait()
        
        # Grid of 100 squares
        grid = self.create_grid(10, 10, 0.25).shift(RIGHT * 2)
        
        # Color all squares white initially
        for square in grid:
            square.set_fill(WHITE, opacity=0.8)
            
        self.play(Create(grid))
        
        # Color 20 squares red and animate them "peeling off"
        red_squares = []
        for i in range(20):
            row = i // 10
            col = i % 10
            square_index = row * 10 + col
            grid[square_index].set_fill(RED, opacity=0.8)
            red_squares.append(grid[square_index])
        
        self.play(*[Flash(square, color=RED) for square in red_squares])
        
        # Group red squares and move them
        red_group = VGroup(*red_squares)
        self.play(
            red_group.animate.shift(DOWN * 2),
            run_time=1.5
        )
        
        # Show calculation
        calculation = MathTex(
            r"\frac{20}{100} \times 300\text{ zł} = 60\text{ zł}",
            font_size=36
        ).next_to(red_group, DOWN)
        
        self.play(Write(calculation))
        self.wait()
        
        # Show new price
        new_price = VGroup(
            Rectangle(width=3, height=1.5, fill_color=WHITE, fill_opacity=1),
            Text("240 zł", font_size=36, color=BLACK)
        )
        new_price[1].move_to(new_price[0].get_center())
        new_price = VGroup(*new_price).next_to(price_tag, DOWN, buff=1)
        
        arrow = Arrow(price_tag.get_bottom(), new_price.get_top(), buff=0.1)
        
        self.play(
            Create(arrow),
            FadeIn(new_price)
        )
        
        # Final message
        final_text = Text(
            "Procent = część setna całości",
            font_size=28
        ).to_edge(DOWN)
        
        self.play(Write(final_text))
        self.wait(2)

    def create_grid(self, rows, cols, square_size):
        grid = VGroup()
        for i in range(rows):
            for j in range(cols):
                square = Square(side_length=square_size)
                square.shift(RIGHT * j * square_size + DOWN * i * square_size)
                grid.add(square)
        grid.center()
        return grid