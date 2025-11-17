from manim import *

class PercentsAsPerHundreds(Scene):
    def construct(self):
        # Title
        title = Text("Procenty = \"Na Sto\"", font_size=48)
        subtitle = Text("Percents = Per-Hundreds", font_size=24, color=GRAY)
        title_group = VGroup(title, subtitle).arrange(DOWN)
        self.play(Write(title), FadeIn(subtitle))
        self.wait(1)
        self.play(FadeOut(title_group))

        # Create battery icon frame
        battery_width = 5
        battery_height = 2.5
        battery_frame = Rectangle(width=battery_width, height=battery_height, color=WHITE, stroke_width=3)
        battery_tip = Rectangle(width=0.3, height=1, color=WHITE, fill_opacity=1)
        battery_tip.next_to(battery_frame, RIGHT, buff=0)
        battery = VGroup(battery_frame, battery_tip)
        battery.move_to(ORIGIN)

        # Create 10x10 grid of squares inside battery
        grid_squares = VGroup()
        square_size = 0.4
        padding = 0.05
        start_x = -battery_width/2 + 0.25
        start_y = battery_height/2 - 0.25

        for row in range(10):
            for col in range(10):
                square = Square(
                    side_length=square_size,
                    fill_color=GREEN,
                    fill_opacity=0.8,
                    stroke_width=1,
                    stroke_color=GREEN_E
                )
                square.move_to([
                    start_x + col * (square_size + padding),
                    start_y - row * (square_size + padding),
                    0
                ])
                grid_squares.add(square)

        # Percentage counter
        percentage_text = Text("100%", font_size=48, color=GREEN)
        percentage_text.next_to(battery, UP, buff=0.5)

        # Show battery with full charge
        self.play(Create(battery))
        self.play(FadeIn(grid_squares), Write(percentage_text))
        self.wait(1)

        # Create phone usage animation (hand icon)
        # For now, use a simple circle to represent touch
        touch = Circle(radius=0.3, color=YELLOW, fill_opacity=0.7)
        touch.next_to(battery, DOWN, buff=1)
        
        # Function to discharge battery
        def discharge_battery(squares_to_discharge):
            # Get currently green squares
            green_squares = [sq for sq in grid_squares if sq.fill_color == GREEN]
            if len(green_squares) >= squares_to_discharge:
                # Select squares to discharge
                for i in range(squares_to_discharge):
                    self.play(
                        green_squares[-(i+1)].animate.set_fill(GREY, opacity=0.3),
                        run_time=0.1
                    )
        
        # Animate phone usage and battery discharge
        usage_label = Text("Używanie telefonu...", font_size=20, color=YELLOW)
        usage_label.next_to(touch, DOWN, buff=0.3)
        
        self.play(FadeIn(touch), Write(usage_label))
        
        # First discharge: 100% -> 95%
        self.play(touch.animate.shift(RIGHT * 0.5), run_time=0.5)
        discharge_battery(5)
        self.play(percentage_text.animate.become(Text("95%", font_size=48, color=GREEN).move_to(percentage_text)))
        
        # Second discharge: 95% -> 87%
        self.play(touch.animate.shift(LEFT * 1), run_time=0.5)
        discharge_battery(8)
        self.play(percentage_text.animate.become(Text("87%", font_size=48, color=GREEN).move_to(percentage_text)))
        
        # Continue to 75%
        self.play(touch.animate.shift(RIGHT * 0.5), run_time=0.5)
        discharge_battery(12)
        self.play(
            percentage_text.animate.become(Text("75%", font_size=48, color=YELLOW).move_to(percentage_text)),
            FadeOut(touch),
            FadeOut(usage_label)
        )
        self.wait(1)

        # Highlight exactly 75 green squares
        green_count = sum(1 for sq in grid_squares if sq.fill_color == GREEN)
        count_label = Text(f"Dokładnie {green_count} z 100 kwadratów jest zielonych", font_size=24)
        count_label.next_to(battery, DOWN, buff=0.5)
        self.play(Write(count_label))
        self.wait(1)

        # Show fraction transformation
        fraction_start = Text("100/100", font_size=72)
        fraction_arrow = Text("→", font_size=48)
        fraction_end = Text("75/100", font_size=72)
        
        fraction_group = VGroup(fraction_start, fraction_arrow, fraction_end).arrange(RIGHT, buff=0.5)
        fraction_group.next_to(count_label, DOWN, buff=0.5)
        
        self.play(Write(fraction_start))
        self.wait(0.5)
        self.play(Write(fraction_arrow))
        self.play(TransformFromCopy(fraction_start, fraction_end))
        self.wait(1)

        # Final message
        self.play(FadeOut(count_label))
        
        final_message = VGroup(
            Text("Procent (%) to po prostu skrót", font_size=28),
            Text("dla ułamka 'na sto' (/100)", font_size=28)
        ).arrange(DOWN, buff=0.2)
        final_message.next_to(fraction_group, DOWN, buff=0.5)
        final_message.set_color(YELLOW)
        
        # Add visual connection
        percent_symbol = Text("75%", font_size=72, color=YELLOW)
        equals = Text("=", font_size=48)
        final_fraction = Text("75/100", font_size=72, color=YELLOW)
        
        equation = VGroup(percent_symbol, equals, final_fraction).arrange(RIGHT, buff=0.3)
        equation.move_to(fraction_group)
        
        self.play(
            ReplacementTransform(fraction_group, equation),
            Write(final_message)
        )
        
        self.wait(3)